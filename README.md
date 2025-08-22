# @netflix-clone/common

[![npm version](https://img.shields.io/npm/v/@netflix-clone/common.svg?color=blue&logo=npm)](https://www.npmjs.com/package/@netflix-clone/common)
[![npm downloads](https://img.shields.io/npm/dm/@netflix-clone/common.svg?color=green)](https://www.npmjs.com/package/@netflix-clone/common)
[![license](https://img.shields.io/github/license/Netflix-Nest/Netflix-Common.svg)](./LICENSE)

**Shared Guards, Interceptors, Decorators, and Exception Filters for Netflix Clone**  
A reusable NestJS package to keep your **microservices** consistent and DRY (Don’t Repeat Yourself).

---

## Features

- **Guards**: JWT Auth Guard, Local Auth Guard
- **Decorators**: `@Public()`, `@SkipCheckPermission()`, `@User()`
- **Interceptors**: Logging, Caching, Transform response
- **Filters**: Global exception filter (support both HTTP & RPC)
- Designed for **NestJS microservices architecture**

---

## Installation

```bash
npm install @netflix-clone/common
# or
yarn add @netflix-clone/common
```

Peer dependencies (must be installed in your NestJS project):

```bash
npm install @nestjs/common @nestjs/core @nestjs/passport @nestjs/microservices @nestjs/cache-manager rxjs
```

## Usage

1. Guards

```bash
import { JwtAuthGuard, LocalAuthGuard } from '@netflix-clone/common';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile() {
    return { message: 'Protected route with JWT!' };
  }
}
```

2. Decorators

```bash
import { Controller, Get } from '@nestjs/common';
import { Public, User } from '@netflix-clone/common';

@Controller('auth')
export class AuthController {
  @Public()
  @Get('login')
  login() {
    return { message: 'Public endpoint (no JWT required)' };
  }

  @Get('me')
  getMe(@User() user: any) {
    return user;
  }
}

```

3. Interceptors

```bash
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor, TransformInterceptor, CacheInterceptor } from '@netflix-clone/common';

@Controller('movies')
@UseInterceptors(LoggingInterceptor, TransformInterceptor, CacheInterceptor)
export class MovieController {
  @Get()
  findAll() {
    return [{ id: 1, title: 'Inception' }];
  }
}
```

4. Exception Filters

```bash
import { AllExceptionsFilter } from '@netflix-clone/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
```

## License

MIT © 2025 Cao Nguyen Tri Ngoc 😎.
