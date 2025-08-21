import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Logger,
} from "@nestjs/common";
import { Response } from "express";
import { Observable, tap, map } from "rxjs";
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
	intercept(
		context: ExecutionContext,
		next: CallHandler<T>
	): Observable<any> {
		const ctx = context.switchToHttp();
		const response = ctx.getResponse<Response>();
		return next.handle().pipe(
			map((data) => ({
				statusCode: response.status,
				data,
				timestamp: new Date().toISOString(),
			}))
		);
	}
}
