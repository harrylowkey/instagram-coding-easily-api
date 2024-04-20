import { InteractionType } from 'discord-interactions';

export class DiscordInteractionDto {
    readonly type: InteractionType;
    readonly data: any;
}
