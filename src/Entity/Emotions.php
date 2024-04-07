<?php

namespace App\Entity;

use App\Repository\EmotionsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EmotionsRepository::class)]
class Emotions
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $emotion_id = null;

    #[ORM\Column(length: 255)]
    private ?string $emotion_name = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getEmotionName(): ?string
    {
        return $this->emotion_name;
    }

    public function setEmotionName(string $emotion_name): static
    {
        $this->emotion_name = $emotion_name;

        return $this;
    }
}
