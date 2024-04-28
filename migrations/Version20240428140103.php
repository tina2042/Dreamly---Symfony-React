<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240428140103 extends AbstractMigration
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
        $this->addSql('CREATE SEQUENCE user_details_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE user_statistics_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE comments (id INT NOT NULL, dream_id INT NOT NULL, owner_id INT NOT NULL, comment_content TEXT NOT NULL, comment_date DATE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_5F9E962AE65343C2 ON comments (dream_id)');
        $this->addSql('CREATE INDEX IDX_5F9E962A7E3C61F9 ON comments (owner_id)');
        $this->addSql('CREATE TABLE dreams (id INT NOT NULL, privacy_id INT NOT NULL, emotion_id INT NOT NULL, owner_id INT NOT NULL, title TEXT NOT NULL, dream_content TEXT NOT NULL, date DATE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_FD07CC0A19877A6A ON dreams (privacy_id)');
        $this->addSql('CREATE INDEX IDX_FD07CC0A1EE4A582 ON dreams (emotion_id)');
        $this->addSql('CREATE INDEX IDX_FD07CC0A7E3C61F9 ON dreams (owner_id)');
        $this->addSql('CREATE TABLE emotions (id INT NOT NULL, emotion_name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE friends (id INT NOT NULL, user_1_id INT NOT NULL, user_2_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_21EE70698A521033 ON friends (user_1_id)');
        $this->addSql('CREATE INDEX IDX_21EE706998E7BFDD ON friends (user_2_id)');
        $this->addSql('CREATE TABLE likes (id INT NOT NULL, dream_id INT NOT NULL, owner_id INT NOT NULL, like_date DATE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_49CA4E7DE65343C2 ON likes (dream_id)');
        $this->addSql('CREATE INDEX IDX_49CA4E7D7E3C61F9 ON likes (owner_id)');
        $this->addSql('CREATE TABLE privacy (id INT NOT NULL, privacy_name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE role (id INT NOT NULL, role_name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, detail_id INT NOT NULL, role_id INT NOT NULL, user_statistics_id INT NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649D8D003BB ON "user" (detail_id)');
        $this->addSql('CREATE INDEX IDX_8D93D649D60322AC ON "user" (role_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D64974AB38E2 ON "user" (user_statistics_id)');
        $this->addSql('CREATE TABLE user_details (id INT NOT NULL, name VARCHAR(255) NOT NULL, surname VARCHAR(255) NOT NULL, photo VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE user_statistics (id INT NOT NULL, dreams_amount INT NOT NULL, like_amount INT NOT NULL, comments_amount INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962AE65343C2 FOREIGN KEY (dream_id) REFERENCES dreams (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962A7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dreams ADD CONSTRAINT FK_FD07CC0A19877A6A FOREIGN KEY (privacy_id) REFERENCES privacy (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dreams ADD CONSTRAINT FK_FD07CC0A1EE4A582 FOREIGN KEY (emotion_id) REFERENCES emotions (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dreams ADD CONSTRAINT FK_FD07CC0A7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE friends ADD CONSTRAINT FK_21EE70698A521033 FOREIGN KEY (user_1_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE friends ADD CONSTRAINT FK_21EE706998E7BFDD FOREIGN KEY (user_2_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE likes ADD CONSTRAINT FK_49CA4E7DE65343C2 FOREIGN KEY (dream_id) REFERENCES dreams (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE likes ADD CONSTRAINT FK_49CA4E7D7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649D8D003BB FOREIGN KEY (detail_id) REFERENCES user_details (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649D60322AC FOREIGN KEY (role_id) REFERENCES role (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D64974AB38E2 FOREIGN KEY (user_statistics_id) REFERENCES user_statistics (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
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
        $this->addSql('DROP SEQUENCE user_details_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE user_statistics_id_seq CASCADE');
        $this->addSql('ALTER TABLE comments DROP CONSTRAINT FK_5F9E962AE65343C2');
        $this->addSql('ALTER TABLE comments DROP CONSTRAINT FK_5F9E962A7E3C61F9');
        $this->addSql('ALTER TABLE dreams DROP CONSTRAINT FK_FD07CC0A19877A6A');
        $this->addSql('ALTER TABLE dreams DROP CONSTRAINT FK_FD07CC0A1EE4A582');
        $this->addSql('ALTER TABLE dreams DROP CONSTRAINT FK_FD07CC0A7E3C61F9');
        $this->addSql('ALTER TABLE friends DROP CONSTRAINT FK_21EE70698A521033');
        $this->addSql('ALTER TABLE friends DROP CONSTRAINT FK_21EE706998E7BFDD');
        $this->addSql('ALTER TABLE likes DROP CONSTRAINT FK_49CA4E7DE65343C2');
        $this->addSql('ALTER TABLE likes DROP CONSTRAINT FK_49CA4E7D7E3C61F9');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649D8D003BB');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649D60322AC');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D64974AB38E2');
        $this->addSql('DROP TABLE comments');
        $this->addSql('DROP TABLE dreams');
        $this->addSql('DROP TABLE emotions');
        $this->addSql('DROP TABLE friends');
        $this->addSql('DROP TABLE likes');
        $this->addSql('DROP TABLE privacy');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE user_details');
        $this->addSql('DROP TABLE user_statistics');
    }
}
