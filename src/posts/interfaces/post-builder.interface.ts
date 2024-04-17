export interface PostBuilderInterface {
    upload(imageUrls: string[], caption: string): Promise<void>;
    generate(): Promise<void>;
}
