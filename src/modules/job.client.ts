import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RMQClientOptions } from "../interfaces/client.options";

@Module({})
export class JobClientModule {
	static register(options: RMQClientOptions): DynamicModule {
		return {
			module: JobClientModule,
			providers: [
				{
					provide: "JOB_SERVICE",
					useFactory: () => {
						return ClientProxyFactory.create({
							transport: Transport.RMQ,
							options: {
								urls: [
									options.urls ||
										"amqp://netflix-rabbitmq:5672",
								],
								queue: options.queue || "job_queue",
								queueOptions: options.queueOptions,
							},
						});
					},
				},
			],
			exports: ["JOB_SERVICE"],
		};
	}
}
