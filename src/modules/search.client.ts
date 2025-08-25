import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RMQClientOptions } from "../interfaces/client.options";

@Module({})
export class SearchClientModule {
	static register(options: RMQClientOptions): DynamicModule {
		return {
			module: SearchClientModule,
			providers: [
				{
					provide: "SEARCH_SERVICE",
					useFactory: () => {
						return ClientProxyFactory.create({
							transport: Transport.RMQ,
							options: {
								urls: [
									options.urls ||
										"amqp://netflix-rabbitmq:5672",
								],
								queue: options.queue || "search_queue",
								queueOptions: options.queueOptions,
							},
						});
					},
				},
			],
			exports: ["SEARCH_SERVICE"],
		};
	}
}
