import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

// import { Logger } from '@nestjs/common';

import { WsAdapter } from '@nestjs/platform-ws';
require('dotenv').config();
require('dotenv').config({
  path: `./environment/.env.${process.env.NODE_ENV}`,
});

async function bootstrap() {


  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Change this to your React app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    
  });
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useStaticAssets(join(__dirname, '..', '..', 'coverage'));

  const swaggerCconfig = new DocumentBuilder()
    .setTitle('BRI WM API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerCconfig);

  SwaggerModule.setup('empApi', app, document);

  app.enableCors(corsOptions);

  // Enable CORS for WebSocket
  // app.useWebSocketAdapter(new WsAdapter(app));
 // Enable CORS for WebSocket
   app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(3500);
 
  console.log(
    `service is running on 3500`
  );
}
bootstrap();
