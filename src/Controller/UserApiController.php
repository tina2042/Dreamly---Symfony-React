<?php

namespace App\Controller;


use App\Entity\Friend;
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
        } else if ($request->isMethod('POST')) {
            return $this->searchFriends($request, $entityManager);
        } else {
            return new Response(null, Response::HTTP_METHOD_NOT_ALLOWED);
        }
    }

    #[Route('/api/user_id', name: 'user_id', methods: ['GET'])]
    #[IsGranted('ROLE_USER', message: 'You must be logged in to see settings.')]
    public function getThisUser(Request $request, EntityManagerInterface $entityManager): Response
    {
        return new JsonResponse($this->getUser()->getId());
    }
    #[Route('/api/search', name: 'search', methods: ['POST'])]
    #[IsGranted('ROLE_USER', message: 'You must be logged in to see settings.')]
    public function searchFriends(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $query = $data['query'] ?? '';

        // Wyszukaj użytkowników po imieniu i nazwisku
        $userRepository = $entityManager->getRepository(User::class);
        $users = $userRepository->findByFirstNameAndLastName($query);
        //Sprawdzanie, którzy użytkownicy są znajomymi
        $userIdentifier = $this->getUser()->getId();
        $friendsRepository = $entityManager->getRepository(Friend::class);
        $friends=[];
        $friendIds = $friendsRepository->findBy(['user_1' => $userIdentifier]);
        foreach ($friendIds as $friend) {
            $friends[] = $friend->getUser2();
        }
        $result=[];
        foreach ($users as $user) {
           if(!in_array($user,$friends)) {
                $result[] = [
                    'id' => $user->getId(),
                    'name' => $user->getDetail()->getName(),
                    'surname' => $user->getDetail()->getSurname(),
                    'photo' => $user->getDetail()->getPhoto()
                ];
            }
        }

        // Zwróć wyniki jako JSON
        return new JsonResponse($result);
    }
}