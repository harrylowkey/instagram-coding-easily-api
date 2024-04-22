/* eslint-disable @typescript-eslint/naming-convention */
import { env } from '~config/env.config';
import { DiscordCreateApplicationCommandType } from '~discord/types/discord-create-application-command.type';
import { HttpBaseService } from '~http-client/services/http-base.service';
import { DiscordCommandService } from './discord-command.service';

export class DiscordClientService extends HttpBaseService {
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
}
