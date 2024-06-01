<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\Dream;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class CommentApiController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager): \Symfony\Component\HttpFoundation\Response
    {
        if ($request->isMethod('POST')) {
            return $this->comment($request, $entityManager);
        } else {
            return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED);
        }
    }
    #[Route('/api/add_comment', name:'add_comment', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function comment(Request $request, EntityManagerInterface $entityManager): \Symfony\Component\HttpFoundation\Response
    {
        $owner = $this->getUser();
        $data = json_decode($request->getContent(), true);
        $comment = new Comment();
        $comment->setCommentContent($data['comment']);
        $dream = $entityManager->getRepository(Dream::class)->find($data['dream_id']);
        $comment->setDream($dream);
        $comment->setOwner($owner);
        $entityManager->persist($comment);
        $entityManager->flush();

        return $this->json([
            'message' => 'ok'
        ]);

    }

}