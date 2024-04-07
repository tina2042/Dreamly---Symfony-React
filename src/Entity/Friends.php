<?php

namespace App\Entity;

use App\Repository\FriendsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FriendsRepository::class)]
class Friends
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $friendship_id = null;

    #[ORM\Column]
    private ?int $user_id = null;

    #[ORM\Column]
    private ?int $friend_id = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFriendshipId(): ?int
    {
        return $this->friendship_id;
    }

    public function setFriendshipId(int $friendship_id): static
    {
        $this->friendship_id = $friendship_id;

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

    public function getFriendId(): ?int
    {
        return $this->friend_id;
    }

    public function setFriendId(int $friend_id): static
    {
        $this->friend_id = $friend_id;

        return $this;
    }
}
