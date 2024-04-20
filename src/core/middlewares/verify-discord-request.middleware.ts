import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import { env } from '~config/env.config';

export class VerifyDiscordRequestMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): any {
        verifyKeyMiddleware(env.DISCORD.PUBLIC_KEY)(req, res, next);
    }
}
