import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RMQClientOptions } from "../interfaces/client.options";

@Module({})
export class RecommendationClientModule {
	static register(options: RMQClientOptions): DynamicModule {
		return {
			module: RecommendationClientModule,
			providers: [
				{
					provide: "RECOMMENDATION_SERVICE",
					useFactory: () => {
						return ClientProxyFactory.create({
							transport: Transport.RMQ,
							options: {
								urls: [
									options.urls ||
										"amqp://netflix-rabbitmq:5672",
								],
								queue: options.queue || "recommendation_queue",
								queueOptions: options.queueOptions,
							},
						});
					},
				},
			],
			exports: ["RECOMMENDATION_SERVICE"],
		};
	}
}
