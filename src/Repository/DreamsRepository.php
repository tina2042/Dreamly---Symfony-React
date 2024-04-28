<?php

namespace App\Repository;

use App\Entity\Dream;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Dreams>
 *
 * @method Dream|null find($id, $lockMode = null, $lockVersion = null)
 * @method Dream|null findOneBy(array $criteria, array $orderBy = null)
 * @method Dream[]    findAll()
 * @method Dream[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DreamsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Dream::class);
    }

    //    /**
    //     * @return Dreams[] Returns an array of Dreams objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('d.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Dreams
    //    {
    //        return $this->createQueryBuilder('d')
    //            ->andWhere('d.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
