<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UserController extends AbstractController
{
    #[Route('/user', name: 'user')]
    #[IsGranted('ROLE_USER')]
    public function settings(): Response
    {
        return $this->render('user/settings.html.twig', [
            'userName' => 'Lorem ipsum',
            'userEmail' => 'Lorem ipsum',
            'userSurname' => 'Lorem ipsum',
        ]);
    }
}
