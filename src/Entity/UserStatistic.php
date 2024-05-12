<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserStatisticsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: UserStatisticsRepository::class)]
#[ApiResource]
class UserStatistic
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['user:read', 'user:write'])]
    private ?int $dreams_amount = null;

    #[ORM\Column]
    #[Groups(['user:read', 'user:write'])]
    private ?int $like_amount = null;

    #[ORM\Column]
    #[Groups(['user:read', 'user:write'])]
    private ?int $comments_amount = null;
    public function __construct(){
        $this->dreams_amount = 0;
        $this->like_amount = 0;
        $this->comments_amount = 0;
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDreamsAmount(): ?int
    {
        return $this->dreams_amount;
    }

    public function setDreamsAmount(int $dreams_amount): static
    {
        $this->dreams_amount = $dreams_amount;

        return $this;
    }

    public function getLikeAmount(): ?int
    {
        return $this->like_amount;
    }

    public function setLikeAmount(int $like_amount): static
    {
        $this->like_amount = $like_amount;

        return $this;
    }

    public function getCommentsAmount(): ?int
    {
        return $this->comments_amount;
    }

    public function setCommentsAmount(int $comments_amount): static
    {
        $this->comments_amount = $comments_amount;

        return $this;
    }
}
