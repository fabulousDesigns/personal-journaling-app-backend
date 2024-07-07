import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultCategories1720334972247 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO categories (name) VALUES ('personal'), ('work'), ('travel');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM categories WHERE name IN ('personal', 'work', 'travel');
        `);
  }
}
