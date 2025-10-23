import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as session from 'express-session';
import { adminJsOptions } from './admin/admin.module';

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Configure AdminJS
  const admin = new AdminJS(adminJsOptions);
  
  // Configure authentication
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
    authenticate: async (email: string, password: string) => {
      // Simple authentication - replace with your auth logic
      if (email === 'admin@example.com' && password === 'admin123') {
        return { email: 'admin@example.com', role: 'admin' };
      }
      return null;
    },
    cookieName: 'adminjs',
    cookiePassword: 'secret',
  }, null, {
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
  });

  // Use AdminJS router
  expressApp.use(admin.options.rootPath, adminRouter);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`AdminJS is running on: http://localhost:${process.env.PORT ?? 3000}/admin`);
}
bootstrap();
