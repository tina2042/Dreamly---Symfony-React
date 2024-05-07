<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class CalendarController extends AbstractController
{
    #[Route('/calendar', name: 'calendar')]
    #[IsGranted('ROLE_USER')]
    public function index(): Response
    {
        return $this->render('calendar/calendar.html.twig', [
            'controller_name' => 'CalendarController',
            'dreams'=>['Dream1', 'Dream2']
        ]);
    }
}
