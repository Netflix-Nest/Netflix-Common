import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RMQClientOptions } from "../interfaces/client.options";

@Module({})
export class StorageClientModule {
	static registerAsync(options: RMQClientOptions): DynamicModule {
		return {
			module: StorageClientModule,
			imports: options.imports || [],
			providers: [
				{
					provide: "STORAGE_SERVICE",
					useFactory: async (...args: any[]) => {
						const cfg = options.useFactory(...args);
						return ClientProxyFactory.create({
							transport: Transport.RMQ,
							options: {
								urls: cfg.urls,
								queue: cfg.queue,
								queueOptions: cfg.queueOptions,
							},
						});
					},
					inject: options.inject || [],
				},
			],
			exports: ["STORAGE_SERVICE"],
		};
	}
}
