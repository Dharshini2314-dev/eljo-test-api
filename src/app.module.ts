import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { AuthModule } from './auth/auth.module';
//import { MasterModule } from './master/master.module';
import { EmployeeModule } from './employee/employee/employee.module';
//import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './employee/config/database/database.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    EmployeeModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
   
    DatabaseModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        // tls: {
        //   ciphers: 'SSLv3',
        // },
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'inihsrahdovn41@gmail.com', // generated ethereal user
          pass: 'xvwa txcj utet yoye', // generated ethereal password
        },
      },
      defaults: {
        from: 'inihsrahdovn41@gmail.com', // outgoing email ID
      },
      template: {
        dir: process.cwd() + '/template/',
        //  adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})

export class AppModule {}
