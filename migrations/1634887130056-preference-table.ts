import { MigrationInterface, QueryRunner } from 'typeorm';

export class preferenceTable1634887130056 implements MigrationInterface {
  name = 'preferenceTable1634887130056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`preference\` (\`user_id\` char(36) NOT NULL, \`email_notification\` tinyint NOT NULL DEFAULT false, \`languange\` enum ('id', 'en') NOT NULL DEFAULT 'id', \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`preference\``);
  }
}
