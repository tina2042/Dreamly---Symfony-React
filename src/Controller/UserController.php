<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    #[Route('/user', name: 'user')]
    public function settings(): Response
    {
        $userIdentifier = $this->getUser()->getId();
        return $this->render('user/settings.html.twig', [
            'user_id'=>$userIdentifier
        ]);
    }
    #[Route('/admin', name:'admin')]
    public function admin(): Response
    {
        $userIdentifier = $this->getUser()->getId();
        return $this->render('user/settings_admin.html.twig',
        ['user_id'=>$userIdentifier]);
    }

}
