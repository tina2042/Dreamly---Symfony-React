<?php

namespace App\Entity;

use App\Repository\PrivacyRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PrivacyRepository::class)]
class Privacy
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $privacy_id = null;

    #[ORM\Column(length: 255)]
    private ?string $privacy_name = null;

    public function getId(): ?int
    {
        return $this->id;
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
