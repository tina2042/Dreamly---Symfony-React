<?php

namespace App\Entity;

use App\Repository\UserStatisticsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserStatisticsRepository::class)]
class UserStatistics
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $stat_id = null;

    #[ORM\Column]
    private ?int $user_id = null;

    #[ORM\Column]
    private ?int $dreams_amount = null;

    #[ORM\Column]
    private ?int $like_amount = null;

    #[ORM\Column]
    private ?int $comments_amount = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatId(): ?int
    {
        return $this->stat_id;
    }

    public function setStatId(int $stat_id): static
    {
        $this->stat_id = $stat_id;

        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function setUserId(int $user_id): static
    {
        $this->user_id = $user_id;

        return $this;
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
