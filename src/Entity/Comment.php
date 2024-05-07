<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Tests\Fixtures\Metadata\Get;
use App\Controller\CommentApiController;
use App\Repository\CommentsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CommentsRepository::class)]
#[ApiResource(
    operations:[
        new Get(),
        new GetCollection()
    ],
    normalizationContext: ['groups' => ['comment:read']],
    denormalizationContext: ['groups' => ['comment:write']]
)]
#[Post(
    uriTemplate: '/{dream_id}/add_comment',
    uriVariables: [
        'dream_id' => new Link(
            fromClass: Dream::class
        )
    ],
    controller: CommentApiController::class,
    denormalizationContext: [
        'groups' => ['comment:write']
    ])]
class Comment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['dream:read', 'like:read', 'like:write'])]
    private ?string $comment_content = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['dream:read', 'like:read', 'like:write'])]
    private ?\DateTimeInterface $comment_date;

    #[ORM\ManyToOne(inversedBy: 'comments')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['dream:read', 'like:read', 'like:write'])]
    private ?Dream $dream = null;


    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['dream:read', 'like:read', 'like:write', 'user:read'])]
    private ?User $owner = null;

    public function __construct(){
        $this->comment_date = new \DateTime();
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCommentContent(): ?string
    {
        return $this->comment_content;
    }

    public function setCommentContent(string $comment_content): static
    {
        $this->comment_content = $comment_content;

        return $this;
    }

    public function getCommentDate(): ?\DateTimeInterface
    {
        return $this->comment_date;
    }

    public function getDream(): ?Dream
    {
        return $this->dream;
    }

    public function setDream(?Dream $dream): static
    {
        $this->dream = $dream;

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
