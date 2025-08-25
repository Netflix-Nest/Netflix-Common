import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RedisClientOptions } from "../interfaces/client.options";

@Module({})
export class CommentClientModule {
	static registerAsync(options: RedisClientOptions): DynamicModule {
		return {
			module: CommentClientModule,
			imports: options.imports || [],
			providers: [
				{
					provide: "COMMENT_SERVICE",
					useFactory: async (...args: any[]) => {
						const cfg = options.useFactory(...args);
						return ClientProxyFactory.create({
							transport: Transport.REDIS,
							options: {
								host: cfg.host,
								port: cfg.port,
								password: cfg.password,
							},
						});
					},
					inject: options.inject || [],
				},
			],
			exports: ["COMMENT_SERVICE"],
		};
	}
}
