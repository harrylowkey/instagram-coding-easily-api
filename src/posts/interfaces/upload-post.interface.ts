export interface UploadPostInterface {
    upload(imageUrls: string[], caption: string, interactionToken?: string): Promise<void>;
    confirmUpload(interactionId: string, interactionToken: string, imageUrls: string[], caption: string): Promise<void>;
    cancelUpload(interactionId: string): void;
}
