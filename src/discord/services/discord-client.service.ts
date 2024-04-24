/* eslint-disable @typescript-eslint/naming-convention */
import { env } from '~config/env.config';
import { DiscordCreateApplicationCommandType } from '~discord/types/discord-create-application-command.type';
import { HttpBaseService } from '~http-client/services/http-base.service';
import { DiscordCommandService } from './discord-command.service';

export class DiscordClientService extends HttpBaseService {
    private readonly INSTAGRAM_CODING_EASILY_CHANNEL_ID = '1231215373836357683';
    constructor() {
        super();
        this.configBaseURL('https://discord.com/api/v10');
        this.configHeaders({
            Authorization: `Bot ${env.DISCORD.TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': 'DiscordBot (https://github.com/harrylowkey/instagram-coding-easily-api, 0.0.1)'
        });
    }

    static async config(): Promise<void> {
        return await new DiscordClientService().#installGlobalCommands();
    }

    get #commands(): DiscordCreateApplicationCommandType[] {
        return [
            DiscordCommandService.generatePostCommand(),
            DiscordCommandService.createPostWithCodeCommand(),
            DiscordCommandService.createPostWithImageCommand()
        ];
    }

    async #installGlobalCommands(): Promise<void> {
        await this.put(`/applications/${env.DISCORD.APP_ID}/commands`, this.#commands);
    }

    async #deleteGlobalCommand(permissionCommandId: string): Promise<void> {
        await this.delete(`/applications/${env.DISCORD.APP_ID}/commands/${permissionCommandId}`);
    }

    async createFollowUpMessage(interactionToken: string, data: any): Promise<void> {
        await this.post(`/webhooks/${env.DISCORD.APP_ID}/${interactionToken}`, data);
    }

    async executeWebhook(webhookId: string, webhookToken: string, data: any): Promise<void> {
        await this.post(`/webhooks/${webhookId}/${webhookToken}`, data);
    }

    async createMessage(channelId: string, data: any): Promise<void> {
        await this.post(`/channels/${channelId}/messages`, data);
    }

    async getGuildChannels(): Promise<any> {
        console.log(env.DISCORD.GUILD_ID);
        const channels = await this.get(`/guilds/${env.DISCORD.GUILD_ID}/channels`);
        console.log(channels);
    }

    async sendMessageToInstagramCodingEasyChannel(data: any): Promise<void> {
        await this.createMessage(this.INSTAGRAM_CODING_EASILY_CHANNEL_ID, data);
    }
}
