<?php

namespace App\Controller;

use App\Entity\Friend;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class DreamFriendApiController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('GET')) {
            return $this->view_friend_dreams($request, $entityManager);
        } else {
            return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED);
        }
    }
    #[Route('/api/friends/dreams', name: 'friends_dreams', methods: ['GET'])]
    #[IsGranted('ROLE_USER', message: 'You must be logged in to see other dreams.')]
    public function view_friend_dreams(Request $request, EntityManagerInterface $entityManager): Response
    {
        $userIdentifier = $this->getUser()->getId();
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($userIdentifier);
        $userId=$user->getId();
        $friendsRepository = $entityManager->getRepository(Friend::class);
        $friends = $friendsRepository->findBy(['user_1' => $userId]);
        if($friends==null){
            $friends=$friendsRepository->findBy(['user_2' => $userId]);
        }
        if($friends==null){
            return $this->json([
                'friend' => null
            ]);
        }

        return $this->json([
            'friend' => $friends
        ]);
    }

}