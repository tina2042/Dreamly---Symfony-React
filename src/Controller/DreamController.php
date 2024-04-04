<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class DreamController extends AbstractController
{
    #[Route('/dreams/{dream_id}', name: 'dreams', defaults:['dream_id'=>null], methods: ['GET','HEAD'])]
    public function index($dream_id): JsonResponse
    {
        return $this->json([
            'message' => 'View a dream of '.$dream_id.' id',
            'path' => 'src/Controller/DreamController.php',
        ]);
    }
}
