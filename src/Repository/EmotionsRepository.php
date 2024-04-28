<?php

namespace App\Repository;

use App\Entity\Emotions;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Emotions>
 *
 * @method Emotions|null find($id, $lockMode = null, $lockVersion = null)
 * @method Emotions|null findOneBy(array $criteria, array $orderBy = null)
 * @method Emotions[]    findAll()
 * @method Emotions[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EmotionsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Emotions::class);
    }

    //    /**
    //     * @return Emotions[] Returns an array of Emotions objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('e')
    //            ->andWhere('e.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('e.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Emotions
    //    {
    //        return $this->createQueryBuilder('e')
    //            ->andWhere('e.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
