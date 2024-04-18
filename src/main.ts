import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionFilter } from "src/all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  app.setGlobalPrefix("api/v1");
  await app.listen(9000, () => console.log("Server is running on port 6000"));
}
bootstrap();
