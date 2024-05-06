<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240505182711 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE comment_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE dream_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE emotion_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE friend_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE privacy_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE role_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE user_detail_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE user_like_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE user_statistic_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE comment (id INT NOT NULL, dream_id INT NOT NULL, owner_id INT NOT NULL, comment_content TEXT NOT NULL, comment_date DATE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_9474526CE65343C2 ON comment (dream_id)');
        $this->addSql('CREATE INDEX IDX_9474526C7E3C61F9 ON comment (owner_id)');
        $this->addSql('CREATE TABLE dream (id INT NOT NULL, privacy_id INT NOT NULL, emotion_id INT NOT NULL, owner_id INT NOT NULL, title TEXT NOT NULL, dream_content TEXT NOT NULL, date DATE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_6A5F004F19877A6A ON dream (privacy_id)');
        $this->addSql('CREATE INDEX IDX_6A5F004F1EE4A582 ON dream (emotion_id)');
        $this->addSql('CREATE INDEX IDX_6A5F004F7E3C61F9 ON dream (owner_id)');
        $this->addSql('CREATE TABLE emotion (id INT NOT NULL, emotion_name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE friend (id INT NOT NULL, user_1_id INT NOT NULL, user_2_id INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_55EEAC618A521033 ON friend (user_1_id)');
        $this->addSql('CREATE INDEX IDX_55EEAC6198E7BFDD ON friend (user_2_id)');
        $this->addSql('CREATE TABLE privacy (id INT NOT NULL, privacy_name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE role (id INT NOT NULL, role_name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, detail_id INT NOT NULL, role_id INT NOT NULL, user_statistics_id INT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649D8D003BB ON "user" (detail_id)');
        $this->addSql('CREATE INDEX IDX_8D93D649D60322AC ON "user" (role_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D64974AB38E2 ON "user" (user_statistics_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL ON "user" (email)');
        $this->addSql('CREATE TABLE user_detail (id INT NOT NULL, name VARCHAR(255) NOT NULL, surname VARCHAR(255) NOT NULL, photo VARCHAR(255) DEFAULT \'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y\' NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE user_like (id INT NOT NULL, dream_id INT NOT NULL, owner_id INT NOT NULL, like_date DATE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D6E20C7AE65343C2 ON user_like (dream_id)');
        $this->addSql('CREATE INDEX IDX_D6E20C7A7E3C61F9 ON user_like (owner_id)');
        $this->addSql('CREATE TABLE user_statistic (id INT NOT NULL, dreams_amount INT NOT NULL, like_amount INT NOT NULL, comments_amount INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CE65343C2 FOREIGN KEY (dream_id) REFERENCES dream (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dream ADD CONSTRAINT FK_6A5F004F19877A6A FOREIGN KEY (privacy_id) REFERENCES privacy (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dream ADD CONSTRAINT FK_6A5F004F1EE4A582 FOREIGN KEY (emotion_id) REFERENCES emotion (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dream ADD CONSTRAINT FK_6A5F004F7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE friend ADD CONSTRAINT FK_55EEAC618A521033 FOREIGN KEY (user_1_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE friend ADD CONSTRAINT FK_55EEAC6198E7BFDD FOREIGN KEY (user_2_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649D8D003BB FOREIGN KEY (detail_id) REFERENCES user_detail (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649D60322AC FOREIGN KEY (role_id) REFERENCES role (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D64974AB38E2 FOREIGN KEY (user_statistics_id) REFERENCES user_statistic (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_like ADD CONSTRAINT FK_D6E20C7AE65343C2 FOREIGN KEY (dream_id) REFERENCES dream (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_like ADD CONSTRAINT FK_D6E20C7A7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE comment_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE dream_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE emotion_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE friend_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE privacy_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE role_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('DROP SEQUENCE user_detail_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE user_like_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE user_statistic_id_seq CASCADE');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526CE65343C2');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526C7E3C61F9');
        $this->addSql('ALTER TABLE dream DROP CONSTRAINT FK_6A5F004F19877A6A');
        $this->addSql('ALTER TABLE dream DROP CONSTRAINT FK_6A5F004F1EE4A582');
        $this->addSql('ALTER TABLE dream DROP CONSTRAINT FK_6A5F004F7E3C61F9');
        $this->addSql('ALTER TABLE friend DROP CONSTRAINT FK_55EEAC618A521033');
        $this->addSql('ALTER TABLE friend DROP CONSTRAINT FK_55EEAC6198E7BFDD');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649D8D003BB');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649D60322AC');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D64974AB38E2');
        $this->addSql('ALTER TABLE user_like DROP CONSTRAINT FK_D6E20C7AE65343C2');
        $this->addSql('ALTER TABLE user_like DROP CONSTRAINT FK_D6E20C7A7E3C61F9');
        $this->addSql('DROP TABLE comment');
        $this->addSql('DROP TABLE dream');
        $this->addSql('DROP TABLE emotion');
        $this->addSql('DROP TABLE friend');
        $this->addSql('DROP TABLE privacy');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE user_detail');
        $this->addSql('DROP TABLE user_like');
        $this->addSql('DROP TABLE user_statistic');
    }
}
