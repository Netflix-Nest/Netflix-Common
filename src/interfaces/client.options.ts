import { AmqplibQueueOptions } from "@nestjs/microservices/external/rmq-url.interface";

export interface RedisClientOptions {
	useFactory: (...args: any[]) => {
		host: string;
		port: number;
		password?: string;
	};
	inject?: any[];
	imports?: any[];
}

export interface RMQClientOptions {
	useFactory: (...args: any[]) => {
		urls: string[];
		queue: string;
		queueOptions?: AmqplibQueueOptions;
	};
	inject?: any[];
	imports?: any[];
}
