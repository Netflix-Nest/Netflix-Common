import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RMQClientOptions } from "../interfaces/client.options";

@Module({})
export class InteractionClientModule {
	static register(options: RMQClientOptions): DynamicModule {
		return {
			module: InteractionClientModule,
			providers: [
				{
					provide: "INTERACTION_SERVICE",
					useFactory: () => {
						return ClientProxyFactory.create({
							transport: Transport.RMQ,
							options: {
								urls: [
									options.urls ||
										"amqp://netflix-rabbitmq:5672",
								],
								queue: options.queue || "interaction_queue",
								queueOptions: options.queueOptions,
							},
						});
					},
				},
			],
			exports: ["INTERACTION_SERVICE"],
		};
	}
}
