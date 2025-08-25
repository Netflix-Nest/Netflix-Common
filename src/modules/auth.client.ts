import { DynamicModule, Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RedisClientOptions } from "../interfaces/client.options";

@Module({})
export class AuthClientModule {
	static registerAsync(options: RedisClientOptions): DynamicModule {
		return {
			module: AuthClientModule,
			imports: options.imports || [],
			providers: [
				{
					provide: "AUTH_SERVICE",
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
			exports: ["AUTH_SERVICE"],
		};
	}
}
