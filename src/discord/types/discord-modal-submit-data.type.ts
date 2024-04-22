/* eslint-disable @typescript-eslint/naming-convention */

import { MessageComponentTypes } from 'discord-interactions';

export type ModalSubmitComponentDetailType = {
    custom_id: string;
    type: MessageComponentTypes;
    value?: string;
};

export type ModalSubmitComponentType = {
    custom_id: string;
    type: MessageComponentTypes;
    components: ModalSubmitComponentDetailType[];
};

export type DiscordModalSubmitDataType = {
    custom_id: string;
    components: ModalSubmitComponentType[];
};
