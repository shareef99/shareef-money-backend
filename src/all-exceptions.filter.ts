import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";

type CustomResponse = {
  statusCode: number;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const customResponse: CustomResponse = {
      statusCode: 500,
      path: request.url,
      response: "",
    };

    if (exception instanceof HttpException) {
      customResponse.statusCode = exception.getStatus();
      customResponse.response = exception.getResponse();
    } else if (exception instanceof Error) {
      customResponse.statusCode = HttpStatus.BAD_REQUEST;
      customResponse.response = exception.message;
    } else if (typeof exception === "string") {
      customResponse.statusCode = HttpStatus.BAD_REQUEST;
      customResponse.response = exception;
    } else if (exception instanceof Object) {
      customResponse.statusCode = HttpStatus.BAD_REQUEST;
      customResponse.response = JSON.stringify(exception);
    } else {
      customResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      customResponse.response = "Internal server error";
    }

    response.status(customResponse.statusCode).json(customResponse);

    super.catch(exception, host);
  }
}
