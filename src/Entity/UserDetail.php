<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserDetailsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: UserDetailsRepository::class)]
#[ApiResource]

class UserDetail
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:write', 'dream:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:write', 'dream:read'])]
    private ?string $surname = null;

    #[ORM\Column(length: 255, options: ['default' => 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'])]
    #[Groups(['user:read', 'user:write', 'dream:read'])]
    private ?string $photo = null;

    public function __construct(){
        $this->photo = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getSurname(): ?string
    {
        return $this->surname;
    }

    public function setSurname(string $surname): static
    {
        $this->surname = $surname;

        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(string $photo): static
    {

        $this->photo = $photo;

        return $this;
    }
}
