<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Tests\Fixtures\Metadata\Get;
use App\Controller\DreamApiController;
use App\Controller\DreamController;
use App\Controller\DreamFriendApiController;
use App\Repository\DreamsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DreamsRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
    ],
    normalizationContext: [
        'groups' => ['dream:read']
    ],
    denormalizationContext: [
        'groups' => ['dream:write']
    ]
)]
#[GetCollection(
    uriTemplate: '/dreams',
    controller: DreamApiController::class,
    description: 'Get dreams of user',
    normalizationContext: [
        'groups' => ['dream:read']
    ]
)]
#[GetCollection(
    uriTemplate: '/friends/dreams',
    controller: DreamFriendApiController::class,
    description: 'Get dreams of user friends',
    normalizationContext: [
        'groups' => ['dream:read']
    ]
)]

#[Post(
    uriTemplate: '/api/add_dream',
    controller: DreamApiController::class,
    description: 'Add a dream',
    denormalizationContext: [
        'groups' => ['dream:write']
    ]
)]
#[Delete(
    uriTemplate: '/api/remove_dream/{dream_id}',
    uriVariables: [
        'dream_id' => new Link(
            fromClass: Dream::class
        )
    ],
    controller: DreamApiController::class,
    description: "Remove a dream with dream_id"

)]

#[UniqueEntity(fields: ['id'], message: "There is already a dream with this id")]
class Dream
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['dream:write', 'dream:read', 'user:read'])]
    #[Assert\NotBlank]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['dream:write', 'dream:read', 'user:read'])]
    #[Assert\NotBlank]
    private ?string $dream_content = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['dream:read'])]
    #[Assert\NotBlank]
    #[Assert\Type("\DateTime")]
    private ?\DateTimeInterface $date;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['dream:write', 'dream:read', 'user:read'])]
    private ?Privacy $privacy = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['dream:write', 'dream:read', 'user:read'])]
    private ?Emotion $emotion = null;


    /**
     * @var Collection<int, Comment>
     */
    #[ORM\OneToMany(targetEntity: Comment::class, mappedBy: 'dream', orphanRemoval: true)]
    #[Groups(['dream:read', 'user:read', 'dream:write', 'user:write'])]
    private Collection $comments;

    /**
     * @var Collection<int, UserLike>
     */
    #[ORM\OneToMany(targetEntity: UserLike::class, mappedBy: 'dream', orphanRemoval: true)]
    #[Groups(['dream:read', 'user:read'])]
    private Collection $likes;

    #[ORM\ManyToOne(inversedBy: 'dreams')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['dream:read','dream:write', 'user:read'])]
    private ?User $owner = null;

    public function __construct()
    {
        $this->date = new \DateTime();
        $this->comments = new ArrayCollection();
        $this->likes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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


    public function getPrivacy(): ?Privacy
    {
        return $this->privacy;
    }

    public function setPrivacy(?Privacy $privacy): static
    {
        $this->privacy = $privacy;

        return $this;
    }

    public function getEmotion(): ?Emotion
    {
        return $this->emotion;
    }

    public function setEmotion(?Emotion $emotion): static
    {
        $this->emotion = $emotion;

        return $this;
    }


    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setDream($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getDream() === $this) {
                $comment->setDream(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UserLike>
     */
    public function getLikes(): Collection
    {
        return $this->likes;
    }

    public function addLike(UserLike $like): static
    {
        if (!$this->likes->contains($like)) {
            $this->likes->add($like);
            $like->setDream($this);
        }

        return $this;
    }

    public function removeLike(UserLike $like): static
    {
        if ($this->likes->removeElement($like)) {
            // set the owning side to null (unless already changed)
            if ($like->getDream() === $this) {
                $like->setDream(null);
            }
        }

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }
}
