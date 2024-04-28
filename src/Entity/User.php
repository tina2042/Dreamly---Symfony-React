<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ApiResource]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?UserDetails $detail = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Role $role = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?UserStatistics $userStatistics = null;

    /**
     * @var Collection<int, Dreams>
     */
    #[ORM\OneToMany(targetEntity: Dreams::class, mappedBy: 'owner', orphanRemoval: true)]
    private Collection $dreams;

    /**
     * @var Collection<int, Friends>
     */
    #[ORM\OneToMany(targetEntity: Friends::class, mappedBy: 'user_1', orphanRemoval: true)]
    private Collection $friends;

    /**
     * @var Collection<int, Likes>
     */
    #[ORM\OneToMany(targetEntity: Likes::class, mappedBy: 'owner', orphanRemoval: true)]
    private Collection $likes;

    public function __construct()
    {
        $this->dreams = new ArrayCollection();
        $this->friends = new ArrayCollection();
        $this->likes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getDetail(): ?UserDetails
    {
        return $this->detail;
    }

    public function setDetail(UserDetails $detail): static
    {
        $this->detail = $detail;

        return $this;
    }

    public function getRole(): ?Role
    {
        return $this->role;
    }

    public function setRole(?Role $role): static
    {
        $this->role = $role;

        return $this;
    }

    public function getUserStatistics(): ?UserStatistics
    {
        return $this->userStatistics;
    }

    public function setUserStatistics(UserStatistics $userStatistics): static
    {
        $this->userStatistics = $userStatistics;

        return $this;
    }

    /**
     * @return Collection<int, Dreams>
     */
    public function getDreams(): Collection
    {
        return $this->dreams;
    }

    public function addDream(Dreams $dream): static
    {
        if (!$this->dreams->contains($dream)) {
            $this->dreams->add($dream);
            $dream->setOwner($this);
        }

        return $this;
    }

    public function removeDream(Dreams $dream): static
    {
        if ($this->dreams->removeElement($dream)) {
            // set the owning side to null (unless already changed)
            if ($dream->getOwner() === $this) {
                $dream->setOwner(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Friends>
     */
    public function getFriends(): Collection
    {
        return $this->friends;
    }

    public function addFriend(Friends $friend): static
    {
        if (!$this->friends->contains($friend)) {
            $this->friends->add($friend);
            $friend->setUser1($this);
        }

        return $this;
    }

    public function removeFriend(Friends $friend): static
    {
        if ($this->friends->removeElement($friend)) {
            // set the owning side to null (unless already changed)
            if ($friend->getUser1() === $this) {
                $friend->setUser1(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Likes>
     */
    public function getLikes(): Collection
    {
        return $this->likes;
    }

    public function addLike(Likes $like): static
    {
        if (!$this->likes->contains($like)) {
            $this->likes->add($like);
            $like->setOwner($this);
        }

        return $this;
    }

    public function removeLike(Likes $like): static
    {
        if ($this->likes->removeElement($like)) {
            // set the owning side to null (unless already changed)
            if ($like->getOwner() === $this) {
                $like->setOwner(null);
            }
        }

        return $this;
    }
}
