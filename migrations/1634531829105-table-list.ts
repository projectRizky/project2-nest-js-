import { MigrationInterface, QueryRunner } from 'typeorm';

export class tableList1634531829105 implements MigrationInterface {
  name = 'tableList1634531829105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`stream_products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `INSERT INTO \`stream_products\` (\`name\`) VALUES ('Stream Universe');`,
    );
    await queryRunner.query(
      `CREATE TABLE \`login_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NULL, \`status_login\` int NOT NULL, \`device\` varchar(255) NOT NULL, \`ip\` varchar(255) NOT NULL, \`os\` varchar(255) NOT NULL, \`browser\` varchar(255) NOT NULL, \`brand\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`source_product\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`send_otp_logs\` (\`id\` char(36) NOT NULL, \`phone_number\` varchar(255) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`phone_number_idx\` (\`phone_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` char(36) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`email_verified\` tinyint NOT NULL DEFAULT 0, \`password\` varchar(255) NULL, \`date_of_birth\` timestamp NULL, \`gender\` enum ('male', 'female', 'undefined') NOT NULL DEFAULT 'undefined', \`phone_number\` varchar(255) NULL, \`avatar\` text NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`full_name_idx\` (\`full_name\`), INDEX \`username_idx\` (\`username\`), INDEX \`email_idx\` (\`email\`), INDEX \`phone_number_idx\` (\`phone_number\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_17d1817f241f10a3dbafb169fd\` (\`phone_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`send_mail_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('verify', 'reset', 'undefined') NOT NULL DEFAULT 'undefined', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`email\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`login_log\` ADD CONSTRAINT \`FK_6dc5bbbd7f0889a59618f31241c\` FOREIGN KEY (\`source_product\`) REFERENCES \`stream_products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`send_mail_logs\` ADD CONSTRAINT \`FK_df87856e09c9c2bc265ceab3e27\` FOREIGN KEY (\`email\`) REFERENCES \`users\`(\`email\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`send_mail_logs\` DROP FOREIGN KEY \`FK_df87856e09c9c2bc265ceab3e27\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`login_log\` DROP FOREIGN KEY \`FK_6dc5bbbd7f0889a59618f31241c\``,
    );
    await queryRunner.query(`DROP TABLE \`send_mail_logs\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_17d1817f241f10a3dbafb169fd\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(`DROP INDEX \`phone_number_idx\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`email_idx\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`username_idx\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`full_name_idx\` ON \`users\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`phone_number_idx\` ON \`send_otp_logs\``,
    );
    await queryRunner.query(`DROP TABLE \`send_otp_logs\``);
    await queryRunner.query(`DROP TABLE \`login_log\``);
    await queryRunner.query(`DROP TABLE \`stream_products\``);
  }
}
