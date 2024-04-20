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

        const COMMAND = {
            name: 'blep',
            type: 1,
            description: 'Send a random adorable animal photo',
            options: [
                {
                    name: 'animal',
                    description: 'The type of animal',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Dog',
                            value: 'animal_dog'
                        },
                        {
                            name: 'Cat',
                            value: 'animal_cat'
                        },
                        {
                            name: 'Penguin',
                            value: 'animal_penguin'
                        }
                    ]
                },
                {
                    name: 'only_smol',
                    description: 'Whether to show only baby animals',
                    type: 5,
                    required: false
                }
            ]
        };

        return [TEST_COMMAND];
    }

    async #installGlobalCommands(): Promise<void> {
        await this.put(`/applications/${env.DISCORD.APP_ID}/commands`, this.#commands);
    }
}
