<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

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
    #[Route('/api/{dream_id}/add_comment', name:'add_comment', methods: ['POST'])]
    public function comment(Request $request, EntityManagerInterface $entityManager): \Symfony\Component\HttpFoundation\Response
    {
        return $this->json([
            'message' => 'ok'
        ]);

    }

}