<?php

namespace App\Controller;

use App\Entity\Dream;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Attribute\Route;

/**
 * @method getDoctrine()
 */
class DreamController extends AbstractController
{
    #[Route('/dreams/{dream_id}', name: 'dreams', defaults:['dream_id'=>null], methods: ['GET','HEAD'])]
    public function view($dream_id): Response
    {
        return $this->render('dream/view_dream.html.twig', [
            'message' => 'View a dream of '.$dream_id.' id',
            'dream'=>'Lorem ipsum'
        ]);
    }
    #[Route('/add_dream', name: 'add_dream')]
    public function add_dream(Response $response): Response
    {
        return $this->render('dream/add_dream.html.twig');
    }

    #[Route('/dreams_list', name: 'dreams_list', methods: ['GET', 'HEAD'])]
    public function listAll(): Response
    {

        return $this->render('dream/list_dreams.html.twig',
        ['dreams'=>["Dream", "dream2"]]
        );

    }


}
