import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseTable1698493607025 implements MigrationInterface {
    name = 'BaseTable1698493607025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`sender_id\` varchar(36) NULL, \`receiver_id\` varchar(36) NULL, \`group_id\` varchar(36) NULL, \`media_id\` varchar(36) NULL, UNIQUE INDEX \`REL_7d3846d3e3d5fd07241e1aebff\` (\`media_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`media\` (\`id\` varchar(36) NOT NULL, \`link\` varchar(255) NOT NULL, \`type\` enum ('0', '1') NOT NULL, \`post_id\` varchar(36) NULL, \`comment_id\` varchar(36) NULL, \`message_id\` varchar(36) NULL, UNIQUE INDEX \`REL_20dc152fa567df67110b94d6f1\` (\`post_id\`), UNIQUE INDEX \`REL_06df0ecbcc0ce3e024007aef72\` (\`comment_id\`), UNIQUE INDEX \`REL_a33f77c90759d1f2c799941e7d\` (\`message_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` varchar(36) NOT NULL, \`comment\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`post_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, \`media_id\` varchar(36) NULL, \`replied_comment_id\` varchar(36) NULL, UNIQUE INDEX \`REL_64555a834f96e9d38fd8a47908\` (\`media_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, \`media_id\` varchar(36) NULL, UNIQUE INDEX \`REL_049edb1ce7ab3d2a98009b171d\` (\`media_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refresh_token\` varchar(255) NULL, \`avatar\` varchar(255) NULL, \`status\` int NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`group\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_tags\` (\`tag_id\` varchar(36) NOT NULL, \`post_id\` varchar(36) NOT NULL, INDEX \`IDX_192ab488d1c284ac9abe2e3035\` (\`tag_id\`), INDEX \`IDX_5df4e8dc2cb3e668b962362265\` (\`post_id\`), PRIMARY KEY (\`tag_id\`, \`post_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_history_tags\` (\`tag_id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, INDEX \`IDX_7c6cc13b8bf13eb422c6755a28\` (\`tag_id\`), INDEX \`IDX_5aff3d563c39be313062126d06\` (\`user_id\`), PRIMARY KEY (\`tag_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_groups\` (\`user_id\` varchar(36) NOT NULL, \`group_id\` varchar(36) NOT NULL, INDEX \`IDX_95bf94c61795df25a515435010\` (\`user_id\`), INDEX \`IDX_4c5f2c23c34f3921fbad2cd394\` (\`group_id\`), PRIMARY KEY (\`user_id\`, \`group_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_friends\` (\`user_id\` varchar(36) NOT NULL, \`friend_id\` varchar(36) NOT NULL, INDEX \`IDX_73aac2cba30951ed7c7000c614\` (\`user_id\`), INDEX \`IDX_24f1e41a3801477d44228395e3\` (\`friend_id\`), PRIMARY KEY (\`user_id\`, \`friend_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_c0ab99d9dfc61172871277b52f6\` FOREIGN KEY (\`sender_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_f4da40532b0102d51beb220f16a\` FOREIGN KEY (\`receiver_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_840551c7b5a3b5eda2e9b099ef4\` FOREIGN KEY (\`group_id\`) REFERENCES \`group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_7d3846d3e3d5fd07241e1aebff5\` FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE \`media\` ADD CONSTRAINT \`FK_20dc152fa567df67110b94d6f16\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`media\` ADD CONSTRAINT \`FK_06df0ecbcc0ce3e024007aef72f\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`media\` ADD CONSTRAINT \`FK_a33f77c90759d1f2c799941e7db\` FOREIGN KEY (\`message_id\`) REFERENCES \`message\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_8aa21186314ce53c5b61a0e8c93\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_bbfe153fa60aa06483ed35ff4a7\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_64555a834f96e9d38fd8a479083\` FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_3afd85332244fa4ce1a21720e08\` FOREIGN KEY (\`replied_comment_id\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_52378a74ae3724bcab44036645b\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_049edb1ce7ab3d2a98009b171d0\` FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE \`post_tags\` ADD CONSTRAINT \`FK_192ab488d1c284ac9abe2e30356\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`post_tags\` ADD CONSTRAINT \`FK_5df4e8dc2cb3e668b962362265d\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_history_tags\` ADD CONSTRAINT \`FK_7c6cc13b8bf13eb422c6755a287\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_history_tags\` ADD CONSTRAINT \`FK_5aff3d563c39be313062126d06f\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_groups\` ADD CONSTRAINT \`FK_95bf94c61795df25a5154350102\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_groups\` ADD CONSTRAINT \`FK_4c5f2c23c34f3921fbad2cd3940\` FOREIGN KEY (\`group_id\`) REFERENCES \`group\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_friends\` ADD CONSTRAINT \`FK_73aac2cba30951ed7c7000c6142\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_friends\` ADD CONSTRAINT \`FK_24f1e41a3801477d44228395e3b\` FOREIGN KEY (\`friend_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_friends\` DROP FOREIGN KEY \`FK_24f1e41a3801477d44228395e3b\``);
        await queryRunner.query(`ALTER TABLE \`user_friends\` DROP FOREIGN KEY \`FK_73aac2cba30951ed7c7000c6142\``);
        await queryRunner.query(`ALTER TABLE \`user_groups\` DROP FOREIGN KEY \`FK_4c5f2c23c34f3921fbad2cd3940\``);
        await queryRunner.query(`ALTER TABLE \`user_groups\` DROP FOREIGN KEY \`FK_95bf94c61795df25a5154350102\``);
        await queryRunner.query(`ALTER TABLE \`user_history_tags\` DROP FOREIGN KEY \`FK_5aff3d563c39be313062126d06f\``);
        await queryRunner.query(`ALTER TABLE \`user_history_tags\` DROP FOREIGN KEY \`FK_7c6cc13b8bf13eb422c6755a287\``);
        await queryRunner.query(`ALTER TABLE \`post_tags\` DROP FOREIGN KEY \`FK_5df4e8dc2cb3e668b962362265d\``);
        await queryRunner.query(`ALTER TABLE \`post_tags\` DROP FOREIGN KEY \`FK_192ab488d1c284ac9abe2e30356\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_049edb1ce7ab3d2a98009b171d0\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_52378a74ae3724bcab44036645b\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_3afd85332244fa4ce1a21720e08\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_64555a834f96e9d38fd8a479083\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_bbfe153fa60aa06483ed35ff4a7\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_8aa21186314ce53c5b61a0e8c93\``);
        await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_a33f77c90759d1f2c799941e7db\``);
        await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_06df0ecbcc0ce3e024007aef72f\``);
        await queryRunner.query(`ALTER TABLE \`media\` DROP FOREIGN KEY \`FK_20dc152fa567df67110b94d6f16\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_7d3846d3e3d5fd07241e1aebff5\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_840551c7b5a3b5eda2e9b099ef4\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_f4da40532b0102d51beb220f16a\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_c0ab99d9dfc61172871277b52f6\``);
        await queryRunner.query(`DROP INDEX \`IDX_24f1e41a3801477d44228395e3\` ON \`user_friends\``);
        await queryRunner.query(`DROP INDEX \`IDX_73aac2cba30951ed7c7000c614\` ON \`user_friends\``);
        await queryRunner.query(`DROP TABLE \`user_friends\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c5f2c23c34f3921fbad2cd394\` ON \`user_groups\``);
        await queryRunner.query(`DROP INDEX \`IDX_95bf94c61795df25a515435010\` ON \`user_groups\``);
        await queryRunner.query(`DROP TABLE \`user_groups\``);
        await queryRunner.query(`DROP INDEX \`IDX_5aff3d563c39be313062126d06\` ON \`user_history_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_7c6cc13b8bf13eb422c6755a28\` ON \`user_history_tags\``);
        await queryRunner.query(`DROP TABLE \`user_history_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_5df4e8dc2cb3e668b962362265\` ON \`post_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_192ab488d1c284ac9abe2e3035\` ON \`post_tags\``);
        await queryRunner.query(`DROP TABLE \`post_tags\``);
        await queryRunner.query(`DROP TABLE \`group\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_049edb1ce7ab3d2a98009b171d\` ON \`post\``);
        await queryRunner.query(`DROP TABLE \`post\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
        await queryRunner.query(`DROP INDEX \`REL_64555a834f96e9d38fd8a47908\` ON \`comment\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP INDEX \`REL_a33f77c90759d1f2c799941e7d\` ON \`media\``);
        await queryRunner.query(`DROP INDEX \`REL_06df0ecbcc0ce3e024007aef72\` ON \`media\``);
        await queryRunner.query(`DROP INDEX \`REL_20dc152fa567df67110b94d6f1\` ON \`media\``);
        await queryRunner.query(`DROP TABLE \`media\``);
        await queryRunner.query(`DROP INDEX \`REL_7d3846d3e3d5fd07241e1aebff\` ON \`message\``);
        await queryRunner.query(`DROP TABLE \`message\``);
    }

}
