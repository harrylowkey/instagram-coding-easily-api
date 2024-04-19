import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { env } from '~config/env.config';
import { S3Exception } from '~core/exceptions/s3.exception';

export class StorageService {
    private readonly s3Client = new S3Client({});
    constructor() {
        this.s3Client = new S3Client({ region: env.AWS.REGION });
    }

    now() {
        const currentDate = new Date();
        return currentDate.toISOString().split('T')[0];
    }

    generateKey() {
        const now = this.now();
        return `images/${now}/${uuidv4()}.jpg`;
    }

    async uploadFile(file: Buffer) {
        const key = this.generateKey();

        const uploadParams = {
            Bucket: env.AWS.BUCKET_NAME,
            Key: key,
            Body: file
        };

        const uploadCommand = new PutObjectCommand(uploadParams);

        try {
            await this.s3Client.send(uploadCommand);
            return this.generateUrl(key);
        } catch (err) {
            console.log(err);
            throw new S3Exception();
        }
    }

    async generateUrl(key: string) {
        const params = {
            Bucket: env.AWS.BUCKET_NAME,
            Key: key,
            Expires: 60 // seconds
        };

        const command = new GetObjectCommand(params);
        return getSignedUrl(this.s3Client, command, { expiresIn: 60 });
    }
}
