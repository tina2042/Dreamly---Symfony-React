<?php

namespace App\Entity;

use App\Repository\DreamsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DreamsRepository::class)]
class Dreams
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $dream_id = null;

    #[ORM\Column]
    private ?int $user_id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    private ?string $dream_content = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column]
    private ?int $privacy_id = null;

    #[ORM\Column]
    private ?int $emotion_id = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDreamId(): ?int
    {
        return $this->dream_id;
    }

    public function setDreamId(int $dream_id): static
    {
        $this->dream_id = $dream_id;

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

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDreamContent(): ?string
    {
        return $this->dream_content;
    }

    public function setDreamContent(string $dream_content): static
    {
        $this->dream_content = $dream_content;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getPrivacyId(): ?int
    {
        return $this->privacy_id;
    }

    public function setPrivacyId(int $privacy_id): static
    {
        $this->privacy_id = $privacy_id;

        return $this;
    }

    public function getEmotionId(): ?int
    {
        return $this->emotion_id;
    }

    public function setEmotionId(int $emotion_id): static
    {
        $this->emotion_id = $emotion_id;

        return $this;
    }
}
