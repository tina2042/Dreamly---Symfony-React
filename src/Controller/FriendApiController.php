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

class FriendApiController extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('POST')) {
            return $this->add_friend($request, $entityManager);
        } else {
            return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED);
        }
    }
    #[Route('/api/friends/add', name: 'add_friend', methods: ['POST'])]
    #[IsGranted('ROLE_USER', message: 'You must be logged in to add friend.')]
    public function add_friend(Request $request, EntityManagerInterface $entityManager):Response
    {
        $requestData = json_decode($request->getContent(), true);

        $user1Id = $requestData['user_1'];//wtedy w post trzeba podac samo id, nie "/api/users/id"
        $user2Id = $requestData['user_2'];//może do zmieny gdy bedzie logika dodawania znajomych
        $userRepository = $entityManager->getRepository(User::class);
        // Get users from the database
        $user1 = $userRepository->find($user1Id);
        $user2 = $userRepository->find($user2Id);

        // Create the original friend entry
        $friend = new Friend();
        $friend->setUser1($user1);
        $friend->setUser2($user2);

        // Persist the original friend entry
        $entityManager->persist($friend);
        $entityManager->flush();

        // Create the mirrored friend entry
        $mirroredFriend = new Friend();
        $mirroredFriend->setUser1($user2);
        $mirroredFriend->setUser2($user1);

        // Persist the mirrored friend entry
        $entityManager->persist($mirroredFriend);
        $entityManager->flush();

        return $this->json([
            'message' => 'Friends added successfully'
        ]);

    }
}