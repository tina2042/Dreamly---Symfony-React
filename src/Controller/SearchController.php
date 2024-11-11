<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SearchController extends AbstractController
{
    #[Route('/search-dreams', name: 'search-dreams')]
    public function index(): Response
    {
        return $this->render('search-dream/search-dream.html.twig', [
            'controller_name' => 'SearchController',
        ]);
    }
}
