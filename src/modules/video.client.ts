import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RMQClientOptions } from "../interfaces/client.options";

@Module({})
export class VideoClientModule {
	static register(options: RMQClientOptions): DynamicModule {
		return {
			module: VideoClientModule,
			providers: [
				{
					provide: "VIDEO_SERVICE",
					useFactory: () => {
						return ClientProxyFactory.create({
							transport: Transport.RMQ,
							options: {
								urls: [
									options.urls ||
										"amqp://netflix-rabbitmq:5672",
								],
								queue: options.queue || "video_queue",
								queueOptions: options.queueOptions,
							},
						});
					},
				},
			],
			exports: ["VIDEO_SERVICE"],
		};
	}
}
