import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RedisClientOptions } from "../interfaces/client.options";

@Module({})
export class CommentClientModule {
	static register(options: RedisClientOptions): DynamicModule {
		return {
			module: CommentClientModule,
			providers: [
				{
					provide: "COMMENT_SERVICE",
					useFactory: () => {
						return ClientProxyFactory.create({
							transport: Transport.REDIS,
							options: {
								host: options.host || "localhost",
								port: options.port || 6379,
								password: options.password,
							},
						});
					},
				},
			],
			exports: ["COMMENT_SERVICE"],
		};
	}
}
