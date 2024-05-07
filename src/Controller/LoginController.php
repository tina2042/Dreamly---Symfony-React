<?php

namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController
{

    #[Route('/login', name: 'app_login')]
    public function login(Request $request, AuthenticationUtils $authenticationUtils, #[CurrentUser] $user = null): Response
    {
        if ($request->isMethod('POST')) {
            if (!$user) {
                return $this->json([
                    'error' => 'Invalid login request: check that the Content-Type header is "application/json".',
                ], 401);
            }

            return $this->json([
                'user' => $user->getId(),
                'redirect' => $this->generateUrl('home')
            ]);
        }
        return $this->render('security/login_css.html.twig', [
            'last_username' => $authenticationUtils->getLastUsername(),
            'error' => $authenticationUtils->getLastAuthenticationError()
        ]);
    }

    #[Route('/logout', name: 'logout')]
    public function logout(): Response
    {
        throw new \Exception('logout() should never be reached');
//        return $this->redirectToRoute('start_page');
    }
}
