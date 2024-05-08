<?php
namespace App\Controller;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DreamApiController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('POST')) {
            return $this->add_dream($request, $entityManager);
        } elseif ($request->isMethod('DELETE')) {
            return $this->remove_dream($request, $entityManager);
        } else {
            return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED);
        }
    }
    #[Route('/api/add_dream', name: 'add_dream', methods: ['POST'])]
    public function add_dream(Request $request, EntityManagerInterface $entityManager): Response
    {
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