<?php

namespace App\Controller;


use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UserApiController extends AbstractController
{

    public function __invoke(Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('GET')) {
            return $this->getThisUser($request, $entityManager);
            //return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED);
        } else {
            return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED);
        }
    }

    #[Route('/api/user_id', name: 'user_id', methods: ['GET'])]
    #[IsGranted('ROLE_USER', message: 'You must be logged in to see settings.')]
    public function getThisUser(Request $request, EntityManagerInterface $entityManager): Response
    {
        $userIdentifier=$this->getUser()->getId();
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($userIdentifier);

        return new JsonResponse($user->getId());

    }
}