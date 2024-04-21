import { DiscordResolvedAttachmentType } from './discord-resolved-attachment.type';

export type DiscordResolvedDataType = {
    users: any[];
    roles: any[];
    channels: any[];
    messages: any[];
    attachments: DiscordResolvedAttachmentType[];
};
