import { HttpException, HttpStatus } from '@nestjs/common';

export class S3Exception extends HttpException {
    constructor() {
        super('S3 Error', HttpStatus.SERVICE_UNAVAILABLE);
    }
}
