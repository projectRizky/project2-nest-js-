import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateUser1634697835612 implements MigrationInterface {
  name = 'updateUser1634697835612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`phone_verified_at\` datetime NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`countries_id\` mediumint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`states_id\` mediumint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`cities_id\` mediumint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`address\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`address\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`cities_id\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`states_id\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`countries_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`phone_verified_at\``,
    );
  }
}
