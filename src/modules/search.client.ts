import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RMQClientOptions } from "../interfaces/client.options";

@Module({})
export class SearchClientModule {
	static registerAsync(options: RMQClientOptions): DynamicModule {
		return {
			module: SearchClientModule,
			imports: options.imports || [],
			providers: [
				{
					provide: "SEARCH_SERVICE",
					useFactory: async (...args: any[]) => {
						const cfg = options.useFactory(...args);
						return ClientProxyFactory.create({
							transport: Transport.RMQ,
							options: {
								urls: [cfg.urls],
								queue: cfg.queue,
								queueOptions: cfg.queueOptions,
							},
						});
					},
					inject: options.inject || [],
				},
			],
			exports: ["SEARCH_SERVICE"],
		};
	}
}
