<?php

namespace App\Entity;


use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Controller\FriendApiController;
use App\Repository\FriendsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;

#[ORM\Entity(repositoryClass: FriendsRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['friend:read']],
    denormalizationContext: ['groups' => ['friend:write']],
)]
#[ApiFilter(SearchFilter::class, properties: [
    'user_1.email' => 'exact', // Filter dreams by the exact tag name
])]
#[Post(
    uriTemplate: 'friends/add',
    controller: FriendApiController::class,
    denormalizationContext: [
        'groups' => ['dream:write']
    ])]
#[GetCollection(
    normalizationContext: [
    'groups' => ['friend:read']
]
)]
class Friend
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['friend:read'])]
    private ?int $id = null;


    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['friend:read', 'friend:write'])]
    #[SerializedName('user_1')]
    private ?User $user_1 = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['friend:read', 'friend:write'])]
    #[SerializedName('user_2')]
    private ?User $user_2 = null;

    public function getId(): ?int
    {
        return $this->id;
    }


    public function getUser1(): ?User
    {
        return $this->user_1;
    }

    public function setUser1(?User $user_1): static
    {
        $this->user_1 = $user_1;

        return $this;
    }

    public function getUser2(): ?User
    {
        return $this->user_2;
    }

    public function setUser2(?User $user_2): static
    {
        $this->user_2 = $user_2;

        return $this;
    }
}
