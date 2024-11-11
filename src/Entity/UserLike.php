<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Tests\Fixtures\Metadata\Get;
use App\Controller\DreamApiController;
use App\Controller\LikeApiController;
use App\Repository\LikesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: LikesRepository::class)]
#[ApiResource(
    operations:[
        new Get(
            normalizationContext: [ 'groups' => ['like:read'] ],
            denormalizationContext: [ 'groups' => ['like:write'] ]
        ),
        new GetCollection(
            normalizationContext: [ 'groups' => ['like:read'] ],
            denormalizationContext: [ 'groups' => ['like:write'] ]
        ),
        new Delete()
    ],
    normalizationContext: [ 'groups' => ['like:read'] ],
    denormalizationContext: [ 'groups' => ['like:write'] ]
)]
#[Post(
    uriTemplate: '/add_like',
    controller: LikeApiController::class,
    normalizationContext: [
        'groups' => ['like:read']
    ],
    denormalizationContext: [
        'groups' => ['like:write']
    ]
)]
class UserLike
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    //#[Groups([ 'like:read', 'like:write'])]
    private ?\DateTimeInterface $like_date ;

    #[ORM\ManyToOne(inversedBy: 'likes')]
    #[ORM\JoinColumn(nullable: false)]
    //#[Groups(['dream:read', 'like:read', 'like:write'])]
    private ?Dream $dream = null;


    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    //#[Groups(['dream:read', 'like:read', 'like:write', 'user:read'])] zmienione przy get dreams/id, jak zepsulo cos to wrócić
    private ?User $owner = null;

    public function __construct(){
        $this->like_date = new \DateTime();
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLikeDate(): ?\DateTimeInterface
    {
        return $this->like_date;
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
