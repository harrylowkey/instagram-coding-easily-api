export interface UploadPostInterface {
    upload(interactionToken: string, imageUrls: string[], caption: string): Promise<void>;
    confirmUpload(interactionId: string, interactionToken: string, imageUrls: string[], caption: string): Promise<void>;
    cancelUpload(interactionId: string): void;
}
