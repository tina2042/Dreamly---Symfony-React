<?php
namespace App\Controller;
use App\Entity\Dream;
use App\Entity\Tags;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use function Sodium\add;

class DreamApiController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('POST')) {
            return $this->add_dream($request, $entityManager);
        } elseif ($request->isMethod('DELETE')) {
            return $this->remove_dream($request, $entityManager);
        } elseif ($request->isMethod('GET')){
            return $this->get_user_dreams($request, $entityManager);
        } else {
            return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED);
        }
    }
    #[Route('/api/dreams', name: 'dreams', methods: ['GET'])]
    #[IsGranted('ROLE_USER', message: 'You must be logged in to see dreams.')]
    private function get_user_dreams(Request $request, EntityManagerInterface $entityManager): Response
    {

        $userId = $this->getUser()->getId();
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($userId);
        $dreams = $user->getDreams();

        $dreamsData = [];
        foreach ($dreams as $dream) {
            $tags=[];
            foreach ($dream->getTags() as $tag){
                $tag=$tag->getName();
                $tags[]=$tag;
            }
            $dreamsData[] = [
                'ownerName' => $dream->getOwner()->getDetail()->getName(),
                'ownerId'=> $dream->getOwner()->getId(),
                'id' => $dream->getId(),
                'title' => $dream->getTitle(),
                'content' => $dream->getDreamContent(),
                'privacy' => $dream->getPrivacy()->getPrivacyName(),
                'emotion' => $dream->getEmotion()->getEmotionName(),
                'date' => $dream->getDate()->format('Y-m-d H:i:s'),
                'likes' => $dream->getLikes()->count(),
                'commentsAmount' => $dream->getComments()->count(),
                'tags' => $tags
            ];
        }

        return new JsonResponse($dreamsData);
    }

    #[Route('/api/add_dream', name: 'add_dream_api', methods: ['POST'])]
    #[IsGranted('ROLE_USER', message: 'You must be logged in to add a dream.')]
    public function add_dream(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();
        $dream = new Dream();

        $dream->setTitle($data['title']);
        $dream->setDreamContent($data['content']);
        $dream->setOwner($user);
        // Set tags
        $tagsRepository = $entityManager->getRepository('App\Entity\Tags');
        foreach ($data['tags'] as $tagName) {
            // Check if the tag already exists
            $tag = $tagsRepository->findOneBy(['name' => $tagName]);

            // If it doesn't exist, create and persist a new tag
            if (!$tag) {
                $tag = new Tags();
                $tag->setName($tagName);
                $entityManager->persist($tag);
            }

            // Add the tag to the dream
            $dream->addTag($tag);
        }

        //Set privacy and emotion
        $privacyRepository = $entityManager->getRepository('App\Entity\Privacy');
        $privacy = $privacyRepository->findOneBy(['privacy_name' => $data['privacy']]);
        $dream->setPrivacy($privacy);

        $emotionRepository = $entityManager->getRepository('App\Entity\Emotion');
        $emotion = $emotionRepository->findOneBy(['emotion_name' => $data['emotion']]);
        $dream->setEmotion($emotion);

        $statisticsRepository = $entityManager->getRepository('App\Entity\UserStatistic');
        $statistics = $statisticsRepository->findOneBy(['id' => $user->getUserStatistics()->getId()]);
        $statistics->setDreamsAmount($statistics->getDreamsAmount() + 1);
        $entityManager->persist($statistics);

        $entityManager->persist($dream);
        $entityManager->flush();

        return $this->json([
            'message' => 'ok'
        ]);
    }
    #[Route('/api/remove_dream/{dream_id}', name:'remove_dream', methods: ['DELETE'])]
    public function remove_dream(Request $request, EntityManagerInterface $entityManager): Response
    {
        return $this->json([
            'message' => 'ok'
        ]);
    }



}