import { DiscordInteractionDto } from '~discord/http/dto/discord-interaction.dto';

export abstract class ApplicationCommandInteractionHandlerFactory {
    abstract handle(dto: DiscordInteractionDto): Response;
}
