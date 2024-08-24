/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { CustomConfigService } from '../../shared/services/custom-config.service';
require('dotenv').config();
require('dotenv').config({
  path: `./environment/.env.${process.env.NODE_ENV}`,
});
@Module({
  imports: [
 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port:  3306, // default MSSQL port
        database: 'eljo',
        requestTimeout: 15000,
        username: 'root', // Your MySQL username
        password: '', // Your MySQL password
        entities: ['dist/**/*.entity.js'],
        synchronize: false,
       // ssl: new CustomConfigService().get('SSL'), // Adjust based on your environment
        migrations: ['dist/migration/*.js'],
        cli: {
          migrationsDir: 'migration',
        },
        factories: __dirname + '/dist/**/database/factories/**/*.js',
        seeds: __dirname + '/dist/**/database/seeds/**/*.js',
        //   cache: {
        //     duration: 60000, // 60 seconds
        //     type: "database",
        //     tableName: "query-result-cache"
        // }
      }),
      
    }),
  ],
  providers: [],
})
export class DatabaseModule {
  constructor() {}
}
