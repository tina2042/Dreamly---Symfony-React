<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\EmotionsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: EmotionsRepository::class)]
#[ApiResource(
    normalizationContext: [
        'groups' => ['emotion:read']
    ],
    denormalizationContext: [
        'groups' => ['emotion:write']
    ]
)]
#[UniqueEntity(['emotion_name'])]
class Emotion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['emotion:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['emotion:read', 'emotion:write', 'dream:read'])]
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
