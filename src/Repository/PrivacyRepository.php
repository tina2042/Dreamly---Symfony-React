<?php

namespace App\Repository;

use App\Entity\Privacy;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Privacy>
 *
 * @method Privacy|null find($id, $lockMode = null, $lockVersion = null)
 * @method Privacy|null findOneBy(array $criteria, array $orderBy = null)
 * @method Privacy[]    findAll()
 * @method Privacy[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PrivacyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Privacy::class);
    }

    //    /**
    //     * @return Privacy[] Returns an array of Privacy objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Privacy
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
