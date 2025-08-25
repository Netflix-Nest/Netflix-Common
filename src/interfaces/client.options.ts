import { AmqplibQueueOptions } from "@nestjs/microservices/external/rmq-url.interface";

export interface RedisClientOptions {
	host?: string;
	port?: number;
	password?: string;
}

export interface RMQClientOptions {
	urls?: string;
	queue?: string;
	queueOptions?: AmqplibQueueOptions;
}

export interface AuthClientOptions {
	useFactory: (...args: any[]) => {
		host: string;
		port: number;
		password?: string;
	};
	inject?: any[];
	imports?: any[];
}
