<?php

namespace App\Controller;

use App\Entity\Friend;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class DreamFriendApiController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('GET')) {
            return $this->view_friend_dreams($request, $entityManager);
        } else {
            return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED);
        }
    }
    #[Route('/api/friends/dreams', name: 'friends_dreams', methods: ['GET'])]
    #[IsGranted('ROLE_USER', message: 'You must be logged in to see other dreams.')]
    public function view_friend_dreams(Request $request, EntityManagerInterface $entityManager): Response
    {
        $userIdentifier = $this->getUser()->getId();
        $friendsRepository = $entityManager->getRepository(Friend::class);
        $friends=[];
        $friendIds = $friendsRepository->findBy(['user_1' => $userIdentifier]);
        foreach ($friendIds as $friend) {
            $friends[] = $friend->getUser2();
        }
        if($friends==null){
            return $this->json([
                'friendDreams' => null
            ]);
        }

        $friendDreamsAll = [];
        foreach ($friends as $friend){
            if($friend!=null) {
                $friendDreamsAll = array_merge($friendDreamsAll, $friend->getDreams()->toArray());
            }
        }
        $friendDreams=[];
        foreach ($friendDreamsAll as $dream){
            if($dream->getPrivacy()->getPrivacyName()!='PRIVATE'){
                $friendDreams[]=$dream;
            }
        }
        $dreamsData = [];
        foreach ($friendDreams as $dream) {
            $tags=[];
            foreach ($dream->getTags() as $tag){
                $tag=$tag->getName();
                $tags[]=$tag;
            }
            $dreamsData[] = [
                'ownerName' => $dream->getOwner()->getDetail()->getName(),
                'id' => $dream->getId(),
                'title' => $dream->getTitle(),
                'content' => $dream->getDreamContent(),
                'emotion' => $dream->getEmotion()->getEmotionName(),
                'date' => $dream->getDate()->format('Y-m-d'),
                'likes' => $dream->getLikes(),
                'commentsAmount' => $dream->getComments()->count(),
                'tags' => $tags
            ];
        }
        return new JsonResponse($dreamsData);
    }

}