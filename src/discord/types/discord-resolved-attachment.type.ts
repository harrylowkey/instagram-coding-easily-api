export type DiscordResolvedAttachmentType = {
    id: string;
    filename: string;
    description?: string;
    contentType?: string;
    size: number;
    url: string;
    proxyUrl: string;
    height?: number;
    width?: number;
    ephemeral?: boolean;
    durationSecs?: number;
    waveform?: string;
    flags?: number;
};
