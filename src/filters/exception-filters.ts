import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { RpcException } from "@nestjs/microservices";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctxType = host.getType();

    // primordial exception
    this.logException(exception, ctxType as string);

    if (ctxType === "http") {
      this.handleHttpException(exception, host);
    }

    if (ctxType === "rpc") {
      this.handleRpcException(exception, host);
    }
  }

  private handleHttpException(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof RpcException) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      const rpcError = exception.getError();

      // Parse RPC error
      if (typeof rpcError === "object" && rpcError !== null) {
        message = rpcError;
        if ((rpcError as any).statusCode) {
          status = (rpcError as any).statusCode;
        }
      } else {
        message = rpcError || "RPC service error";
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = (exception as any)?.message || "Internal server error";
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: message,
    };

    // Log error response HTTP
    this.logger.error(`HTTP Exception - ${request.method} ${request.url}`, {
      statusCode: status,
      error: message,
      userAgent: request.get("User-Agent"),
      ip: request.ip,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(errorResponse);
  }

  private handleRpcException(exception: unknown, host: ArgumentsHost) {
    let errorResponse: any;
    let shouldThrowNew = false;

    if (exception instanceof RpcException) {
      errorResponse = exception.getError();

      this.logger.error("[RPC Exception] Already RpcException", {
        error: errorResponse,
        type: typeof errorResponse,
        isObject: typeof errorResponse === "object",
      });

      throw exception;
    } else if (exception instanceof HttpException) {
      // Convert HttpException to RpcException
      const httpResponse = exception.getResponse();
      errorResponse = {
        statusCode: exception.getStatus(),
        message: httpResponse,
        timestamp: new Date().toISOString(),
        context: "microservice",
      };
      shouldThrowNew = true;
    } else {
      const error = exception as Error;
      errorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal RPC error",
        timestamp: new Date().toISOString(),
        context: "microservice",
        stack: error.stack,
      };
      shouldThrowNew = true;
    }

    this.logger.error("[RPC Exception] Processing", {
      originalType: exception?.constructor?.name,
      errorResponse,
      shouldThrowNew,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    if (shouldThrowNew) {
      throw new RpcException(errorResponse);
    }
  }

  private logException(exception: unknown, context: string) {
    const errorInfo = {
      context,
      type: exception?.constructor?.name || "Unknown",
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof HttpException) {
      this.logger.error(`[${context.toUpperCase()}] HttpException`, {
        ...errorInfo,
        status: exception.getStatus(),
        response: exception.getResponse(),
        stack: exception.stack,
      });
    } else if (exception instanceof RpcException) {
      const rpcError = exception.getError();
      this.logger.error(`[${context.toUpperCase()}] RpcException`, {
        ...errorInfo,
        error: rpcError,
        errorType: typeof rpcError,
        stack: exception.stack,
      });
    } else if (exception instanceof Error) {
      this.logger.error(`[${context.toUpperCase()}] Error`, {
        ...errorInfo,
        message: exception.message,
        name: exception.name,
        stack: exception.stack,
      });
    } else {
      this.logger.error(`[${context.toUpperCase()}] Unknown Exception`, {
        ...errorInfo,
        exception: JSON.stringify(exception, null, 2),
      });
    }
  }
}
