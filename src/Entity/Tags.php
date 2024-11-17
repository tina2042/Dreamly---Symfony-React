<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TagsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TagsRepository::class)]
#[ApiResource]
class Tags
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::STRING, length: 255, unique: true)]
    #[Groups(['dream:read', 'dream:write'])]
    private ?string $name = null;

    /**
     * @var Collection<int, Dream>
     */
    #[ORM\ManyToMany(targetEntity: Dream::class, inversedBy: 'tags')]
    private Collection $dreams;

    public function __construct()
    {
        $this->dreams = new ArrayCollection();
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

    /**
     * @return Collection<int, Dream>
     */
    public function getDreams(): Collection
    {
        return $this->dreams;
    }

    public function addDream(Dream $dream): static
    {
        if (!$this->dreams->contains($dream)) {
            $this->dreams->add($dream);
        }

        return $this;
    }

    public function removeDream(Dream $dream): static
    {
        $this->dreams->removeElement($dream);

        return $this;
    }
}
