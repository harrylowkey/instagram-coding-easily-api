import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { ApiTags } from '@nestjs/swagger';
import { DiscordService } from '~discord/services/discord.service';
import { DiscordInteractionType } from '~discord/types/discord-interaction.type';

@Controller('discords')
@ApiTags('Discords')
export class DiscordController {
    constructor(private discordService: DiscordService) {}

    @Post('interactions')
    @HttpCode(200)
    handleDiscordBotInteraction(@Body() dto: DiscordInteractionType, @Res() res: Response): Response {
        return this.discordService.handleDiscordBotInteraction(dto, res);
    }
}
