<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PrivacyRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PrivacyRepository::class)]
#[ApiResource]
class Privacy
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $privacy_name = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    #[Groups(['dream:write', 'dream:read'])]
    public function getPrivacyName(): ?string
    {
        return $this->privacy_name;
    }

    public function setPrivacyName(string $privacy_name): static
    {
        $this->privacy_name = $privacy_name;

        return $this;
    }
}
