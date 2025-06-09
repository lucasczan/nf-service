import { NestFactory } from '@nestjs/core';
import { HttpModule } from './http.module';

async function startHttpApplication() {
    const app = await NestFactory.create(HttpModule);
    app.enableCors()
    await app.listen(process.env.PORT ?? 3000);
}

export { startHttpApplication }
