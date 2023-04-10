import { MigrationInterface, QueryRunner } from 'typeorm';

export class countries1634531955431 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`countries\` (\`id\` mediumint UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, \`name\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
          \`iso3\` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`numeric_code\` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`iso2\` char(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`phonecode\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`capital\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`currency\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`currency_symbol\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`tld\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`native\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`region\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`subregion\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`timezones\` json,
          \`translations\` json,
          \`latitude\` decimal(10,8) DEFAULT NULL,
          \`longitude\` decimal(11,8) DEFAULT NULL,
          \`emoji\` varchar(191) COLLATE utf8mb4_general_ci DEFAULT NULL,
          \`emojiU\` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`created_at\` timestamp NULL DEFAULT NULL,
          \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          \`flag\` tinyint(1) NOT NULL DEFAULT '1',
          \`wikiDataId\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Rapid API GeoDB Cities'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`countries\`;`);
  }
}
