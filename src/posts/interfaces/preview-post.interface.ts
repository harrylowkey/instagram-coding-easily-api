export interface PreviewPostInterface {
    generatePreviewPost(interactionToken: string, imageUrls: string[], caption?: string): Promise<void>;
}
