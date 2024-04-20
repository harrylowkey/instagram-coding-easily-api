import { env } from '~config/env.config';
import { DiscordApplicationCommandTypeEnum } from '~discord/enumts/discord-application-command-type.enum';
import { DiscordCommandType } from '~discord/types/discord-command.type';
import { HttpBaseService } from '~http-client/services/http-base.service';

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

    static async config() {
        return await new DiscordClientService().#installGlobalCommands();
    }

    get #commands(): DiscordCommandType[] {
        const TEST_COMMAND = {
            name: 'test',
            description: 'Basic command',
            type: DiscordApplicationCommandTypeEnum.CHAT_INPUT
        };

        const GENERATE_POST_COMMAND = {
            name: 'generate-post',
            description: 'Generate Post command',
            type: DiscordApplicationCommandTypeEnum.CHAT_INPUT
        };

        return [TEST_COMMAND, GENERATE_POST_COMMAND];
    }

    async #installGlobalCommands(): Promise<void> {
        await this.put(`/applications/${env.DISCORD.APP_ID}/commands`, this.#commands);
    }
}
