import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSettingTable1710000000000 implements MigrationInterface {
  name = 'CreateSettingTable1710000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "setting" (
        "key" varchar NOT NULL,
        "namespace" varchar NOT NULL,
        "value" text NOT NULL,
        PRIMARY KEY ("key", "namespace")
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "setting"
    `)
  }
}
