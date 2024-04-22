/* eslint-disable @typescript-eslint/naming-convention */

import { InteractionType } from 'discord-interactions';
import { ApplicationCommandDataType } from './discord-application-command-data.type';
import { DiscordModalSubmitDataType } from './discord-modal-submit-data.type';

type Channel = {
    flags: number;
    guild_id: string;
    icon_emoji: { id: string | null; name: string };
    id: string;
    last_message_id: string;
    name: string;
    nsfw: boolean;
    parent_id: string;
    permissions: string;
    position: number;
    rate_limit_per_user: number;
    theme_color: null;
    topic: null;
    type: number;
};

type Member = {
    avatar: string | null;
    communication_disabled_until: null; // You might want to change the type if it's not always null
    deaf: boolean;
    flags: number;
    joined_at: string;
    mute: boolean;
    nick: string | null;
    pending: boolean;
    permissions: string;
    premium_since: null;
    roles: string[];
    unusual_dm_activity_until: null; // You might want to change the type if it's not always null
    user: {
        avatar: string;
        avatar_decoration_data: null;
        clan: null;
        discriminator: string;
        global_name: string;
        id: string;
        public_flags: number;
        username: string;
    };
};

type Guild = {
    features: string[];
    id: string;
    locale: string;
};

export type DiscordInteractionType = {
    id: string;
    type: InteractionType;
    data: ApplicationCommandDataType | DiscordModalSubmitDataType;
    app_permissions: string;
    application_id: string;
    channel: Channel;
    channel_id: string;
    entitlement_sku_ids: string[];
    entitlements: any[];
    guild: Guild;
    guild_id: string;
    guild_locale: string;
    locale: string;
    member: Member;
    token: string;
    version: number;
};
