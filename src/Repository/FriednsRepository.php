<?php

namespace App\Repository;

use App\Entity\Friedns;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Friedns>
 *
 * @method Friedns|null find($id, $lockMode = null, $lockVersion = null)
 * @method Friedns|null findOneBy(array $criteria, array $orderBy = null)
 * @method Friedns[]    findAll()
 * @method Friedns[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FriednsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Friedns::class);
    }

//    /**
//     * @return Friedns[] Returns an array of Friedns objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('f.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Friedns
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
