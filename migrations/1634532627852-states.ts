import { MigrationInterface, QueryRunner } from 'typeorm';

export class states1634532627852 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`states\` (
          \`id\` mediumint(8) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
          \`name\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
          \`country_id\` mediumint(8) UNSIGNED NOT NULL,
          \`country_code\` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
          \`fips_code\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`iso2\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`type\` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          \`latitude\` decimal(10,8) DEFAULT NULL,
          \`longitude\` decimal(11,8) DEFAULT NULL,
          \`created_at\` timestamp NULL DEFAULT NULL,
          \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          \`flag\` tinyint(1) NOT NULL DEFAULT '1',
          \`wikiDataId\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Rapid API GeoDB Cities'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`states\`;`);
  }
}
