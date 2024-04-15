import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

export class HttpClientException extends HttpException {
    constructor(error: AxiosError) {
        super(error.response?.data?.error?.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
}
