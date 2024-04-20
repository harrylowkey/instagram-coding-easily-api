export interface PostBuilderInterface {
    upload(imageUrls: string[], caption: string): Promise<string>;
    generate(): Promise<string>;
}
