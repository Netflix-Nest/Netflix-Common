import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RMQClientOptions } from "../interfaces/client.options";

@Module({})
export class EngagementClientModule {
	static register(options: RMQClientOptions): DynamicModule {
		return {
			module: EngagementClientModule,
			providers: [
				{
					provide: "ENGAGEMENT_SERVICE",
					useFactory: () => {
						return ClientProxyFactory.create({
							transport: Transport.RMQ,
							options: {
								urls: [
									options.urls ||
										"amqp://netflix-rabbitmq:5672",
								],
								queue: options.queue || "engagement_queue",
								queueOptions: options.queueOptions,
							},
						});
					},
				},
			],
			exports: ["ENGAGEMENT_SERVICE"],
		};
	}
}
