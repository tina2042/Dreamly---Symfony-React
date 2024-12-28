<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;


class DefaultController extends AbstractController
{
    #[Route('/home', name: 'home')]
    #[IsGranted('ROLE_USER')]
    public function home(): Response
    {
        return  $this->render('home/home.html.twig');
    }

    #[Route('/', name: 'welcome')]
    public function welcome(): Response{
        return $this->render('home/welcome.html.twig');
    }

}
