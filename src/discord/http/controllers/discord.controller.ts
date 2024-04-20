import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { ApiTags } from '@nestjs/swagger';
import { DiscordService } from '~discord/services/discord.service';
import { DiscordInteractionDto } from '../dto/discord-interaction.dto';

@Controller('discords')
@ApiTags('Discords')
export class DiscordController {
    constructor(private discordService: DiscordService) {}

    @Post('interactions')
    handleDiscordBotInteraction(@Body() dto: DiscordInteractionDto, @Res() res: Response): Response {
        return this.discordService.handleDiscordBotInteraction(dto, res);
    }
}
