<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

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
    #[Route('/api/{dream_id}/add_like', name:'add_like', methods: ['POST'])]
    public function like(Request $request, EntityManagerInterface $entityManager): \Symfony\Component\HttpFoundation\Response
    {
        return $this->json([
            'message' => 'ok'
        ]);

    }
}
