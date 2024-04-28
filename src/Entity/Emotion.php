<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\EmotionsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EmotionsRepository::class)]
#[ApiResource]
class Emotion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $emotion_name = null;

    public function getId(): ?int
    {
        return $this->id;
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
