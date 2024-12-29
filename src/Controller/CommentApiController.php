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
use Symfony\Component\Serializer\SerializerInterface;

class CommentApiController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): \Symfony\Component\HttpFoundation\Response
    {
        if ($request->isMethod('POST')) {
            return $this->comment($request, $entityManager, $serializer);
        } else {
            return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED);
        }
    }
    #[Route('/api/add_comment', name:'add_comment', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function comment(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): \Symfony\Component\HttpFoundation\Response
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

        $commentJson = $serializer->serialize($comment, 'json', [
            'groups' => ['comment:read'], // Używamy grup serializacji, aby ograniczyć dane
        ]);

        return new Response($commentJson, 200, ['Content-Type' => 'application/json']);

    }

}