<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240407205612 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE comments ADD owner_id INT NOT NULL');
        $this->addSql('ALTER TABLE comments DROP comment_id');
        $this->addSql('ALTER TABLE comments DROP user_id');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962AE65343C2 FOREIGN KEY (dream_id) REFERENCES dreams (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962A7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_5F9E962AE65343C2 ON comments (dream_id)');
        $this->addSql('CREATE INDEX IDX_5F9E962A7E3C61F9 ON comments (owner_id)');
        $this->addSql('ALTER TABLE dreams ADD owner_id INT NOT NULL');
        $this->addSql('ALTER TABLE dreams DROP dream_id');
        $this->addSql('ALTER TABLE dreams DROP user_id');
        $this->addSql('ALTER TABLE dreams ADD CONSTRAINT FK_FD07CC0A7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dreams ADD CONSTRAINT FK_FD07CC0A19877A6A FOREIGN KEY (privacy_id) REFERENCES privacy (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dreams ADD CONSTRAINT FK_FD07CC0A1EE4A582 FOREIGN KEY (emotion_id) REFERENCES emotions (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_FD07CC0A7E3C61F9 ON dreams (owner_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_FD07CC0A19877A6A ON dreams (privacy_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_FD07CC0A1EE4A582 ON dreams (emotion_id)');
        $this->addSql('ALTER TABLE friends ADD base_friend_id INT NOT NULL');
        $this->addSql('ALTER TABLE friends DROP friendship_id');
        $this->addSql('ALTER TABLE friends DROP user_id');
        $this->addSql('ALTER TABLE friends ADD CONSTRAINT FK_21EE70696A5458E8 FOREIGN KEY (friend_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE friends ADD CONSTRAINT FK_21EE7069D978C965 FOREIGN KEY (base_friend_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_21EE70696A5458E8 ON friends (friend_id)');
        $this->addSql('CREATE INDEX IDX_21EE7069D978C965 ON friends (base_friend_id)');
        $this->addSql('ALTER TABLE likes ADD owner_id INT NOT NULL');
        $this->addSql('ALTER TABLE likes DROP like_id');
        $this->addSql('ALTER TABLE likes DROP user_id');
        $this->addSql('ALTER TABLE likes ADD CONSTRAINT FK_49CA4E7DE65343C2 FOREIGN KEY (dream_id) REFERENCES dreams (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE likes ADD CONSTRAINT FK_49CA4E7D7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_49CA4E7DE65343C2 ON likes (dream_id)');
        $this->addSql('CREATE INDEX IDX_49CA4E7D7E3C61F9 ON likes (owner_id)');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649D8D003BB FOREIGN KEY (detail_id) REFERENCES user_details (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D649D60322AC FOREIGN KEY (role_id) REFERENCES role (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649D8D003BB ON "user" (detail_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649D60322AC ON "user" (role_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649D8D003BB');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D649D60322AC');
        $this->addSql('DROP INDEX UNIQ_8D93D649D8D003BB');
        $this->addSql('DROP INDEX UNIQ_8D93D649D60322AC');
        $this->addSql('ALTER TABLE dreams DROP CONSTRAINT FK_FD07CC0A7E3C61F9');
        $this->addSql('ALTER TABLE dreams DROP CONSTRAINT FK_FD07CC0A19877A6A');
        $this->addSql('ALTER TABLE dreams DROP CONSTRAINT FK_FD07CC0A1EE4A582');
        $this->addSql('DROP INDEX UNIQ_FD07CC0A7E3C61F9');
        $this->addSql('DROP INDEX UNIQ_FD07CC0A19877A6A');
        $this->addSql('DROP INDEX UNIQ_FD07CC0A1EE4A582');
        $this->addSql('ALTER TABLE dreams ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE dreams RENAME COLUMN owner_id TO dream_id');
        $this->addSql('ALTER TABLE friends DROP CONSTRAINT FK_21EE70696A5458E8');
        $this->addSql('ALTER TABLE friends DROP CONSTRAINT FK_21EE7069D978C965');
        $this->addSql('DROP INDEX IDX_21EE70696A5458E8');
        $this->addSql('DROP INDEX IDX_21EE7069D978C965');
        $this->addSql('ALTER TABLE friends ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE friends RENAME COLUMN base_friend_id TO friendship_id');
        $this->addSql('ALTER TABLE likes DROP CONSTRAINT FK_49CA4E7DE65343C2');
        $this->addSql('ALTER TABLE likes DROP CONSTRAINT FK_49CA4E7D7E3C61F9');
        $this->addSql('DROP INDEX IDX_49CA4E7DE65343C2');
        $this->addSql('DROP INDEX IDX_49CA4E7D7E3C61F9');
        $this->addSql('ALTER TABLE likes ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE likes RENAME COLUMN owner_id TO like_id');
        $this->addSql('ALTER TABLE comments DROP CONSTRAINT FK_5F9E962AE65343C2');
        $this->addSql('ALTER TABLE comments DROP CONSTRAINT FK_5F9E962A7E3C61F9');
        $this->addSql('DROP INDEX IDX_5F9E962AE65343C2');
        $this->addSql('DROP INDEX IDX_5F9E962A7E3C61F9');
        $this->addSql('ALTER TABLE comments ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE comments RENAME COLUMN owner_id TO comment_id');
    }
}
