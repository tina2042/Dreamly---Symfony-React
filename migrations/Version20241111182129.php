<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241111182129 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE tags_dream (tags_id INT NOT NULL, dream_id INT NOT NULL, PRIMARY KEY(tags_id, dream_id))');
        $this->addSql('CREATE INDEX IDX_13BF6178D7B4FB4 ON tags_dream (tags_id)');
        $this->addSql('CREATE INDEX IDX_13BF617E65343C2 ON tags_dream (dream_id)');
        $this->addSql('ALTER TABLE tags_dream ADD CONSTRAINT FK_13BF6178D7B4FB4 FOREIGN KEY (tags_id) REFERENCES tags (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tags_dream ADD CONSTRAINT FK_13BF617E65343C2 FOREIGN KEY (dream_id) REFERENCES dream (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dream_tags DROP CONSTRAINT fk_10c8c105e65343c2');
        $this->addSql('ALTER TABLE dream_tags DROP CONSTRAINT fk_10c8c1058d7b4fb4');
        $this->addSql('DROP TABLE dream_tags');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE TABLE dream_tags (dream_id INT NOT NULL, tags_id INT NOT NULL, PRIMARY KEY(dream_id, tags_id))');
        $this->addSql('CREATE INDEX idx_10c8c1058d7b4fb4 ON dream_tags (tags_id)');
        $this->addSql('CREATE INDEX idx_10c8c105e65343c2 ON dream_tags (dream_id)');
        $this->addSql('ALTER TABLE dream_tags ADD CONSTRAINT fk_10c8c105e65343c2 FOREIGN KEY (dream_id) REFERENCES dream (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dream_tags ADD CONSTRAINT fk_10c8c1058d7b4fb4 FOREIGN KEY (tags_id) REFERENCES tags (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE tags_dream DROP CONSTRAINT FK_13BF6178D7B4FB4');
        $this->addSql('ALTER TABLE tags_dream DROP CONSTRAINT FK_13BF617E65343C2');
        $this->addSql('DROP TABLE tags_dream');
    }
}
