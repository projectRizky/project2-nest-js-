import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateUser1634798987193 implements MigrationInterface {
  name = 'updateUser1634798987193';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`phone_verified_at\` \`phone_verified\` datetime NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`phone_verified\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`phone_verified\` tinyint NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`phone_verified\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`phone_verified\` datetime NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`phone_verified\` \`phone_verified_at\` datetime NULL`,
    );
  }
}
