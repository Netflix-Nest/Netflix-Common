import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RMQClientOptions } from "../interfaces/client.options";

@Module({})
export class NotificationClientModule {
	static register(options: RMQClientOptions): DynamicModule {
		return {
			module: NotificationClientModule,
			providers: [
				{
					provide: "NOTIFICATION_SERVICE",
					useFactory: () => {
						return ClientProxyFactory.create({
							transport: Transport.RMQ,
							options: {
								urls: [
									options.urls ||
										"amqp://netflix-rabbitmq:5672",
								],
								queue: options.queue || "notification_queue",
								queueOptions: options.queueOptions,
							},
						});
					},
				},
			],
			exports: ["NOTIFICATION_SERVICE"],
		};
	}
}
