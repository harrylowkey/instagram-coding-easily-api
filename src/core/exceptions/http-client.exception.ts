import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

export class HttpClientException extends HttpException {
    constructor(error: AxiosError) {
        // @ts-expect-error: fix later
        super(error.response?.data?.error?.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
}
