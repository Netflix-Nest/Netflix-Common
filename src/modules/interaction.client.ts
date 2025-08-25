import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RMQClientOptions } from "../interfaces/client.options";

@Module({})
export class InteractionClientModule {
	static registerAsync(options: RMQClientOptions): DynamicModule {
		return {
			module: InteractionClientModule,
			imports: options.imports || [],
			providers: [
				{
					provide: "INTERACTION_SERVICE",
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
			exports: ["INTERACTION_SERVICE"],
		};
	}
}
