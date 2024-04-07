<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240407200134 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE comments_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE dreams_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE emotions_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE friends_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE likes_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE privacy_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE role_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE comments (id INT NOT NULL, comment_id INT NOT NULL, dream_id INT NOT NULL, user_id INT NOT NULL, comment_content VARCHAR(255) NOT NULL, comment_date DATE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE dreams (id INT NOT NULL, dream_id INT NOT NULL, user_id INT NOT NULL, title VARCHAR(255) NOT NULL, dream_content VARCHAR(255) NOT NULL, date DATE NOT NULL, privacy_id INT NOT NULL, emotion_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE emotions (id INT NOT NULL, emotion_id INT NOT NULL, emotion_name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE friends (id INT NOT NULL, friendship_id INT NOT NULL, user_id INT NOT NULL, friend_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE likes (id INT NOT NULL, like_id INT NOT NULL, dream_id INT NOT NULL, user_id INT NOT NULL, date DATE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE privacy (id INT NOT NULL, privacy_id INT NOT NULL, privacy_name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE role (id INT NOT NULL, role_id INT NOT NULL, role_name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, user_id INT NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, role_id INT NOT NULL, detail_id INT NOT NULL, PRIMARY KEY(id))');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE comments_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE dreams_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE emotions_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE friends_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE likes_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE privacy_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE role_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('DROP TABLE comments');
        $this->addSql('DROP TABLE dreams');
        $this->addSql('DROP TABLE emotions');
        $this->addSql('DROP TABLE friends');
        $this->addSql('DROP TABLE likes');
        $this->addSql('DROP TABLE privacy');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE "user"');
    }
}
