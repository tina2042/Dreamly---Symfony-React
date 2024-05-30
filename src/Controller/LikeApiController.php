<?php

namespace App\Controller;

use App\Entity\Dream;
use App\Entity\UserLike;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class LikeApiController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager): \Symfony\Component\HttpFoundation\Response
    {
        if ($request->isMethod('POST')) {
            return $this->like($request, $entityManager);
        } else {
            return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED);
        }
    }
    #[Route('/api/add_like', name:'add_like', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function like(Request $request, EntityManagerInterface $entityManager): \Symfony\Component\HttpFoundation\Response
    {
        $data = json_decode($request->getContent(), true);
        $dream = $entityManager->getRepository(Dream::class)->find($data['dream_id']);
        $like = new UserLike();
        $like->setOwner($this->getUser());
        $like->setDream($dream);

        $entityManager->persist($like);
        $entityManager->flush();
        return $this->json([
            'message' => 'Like added correctly',
            'likeId' => $like->getId()
        ]);

    }
}
