import { HttpClientException } from './http-client.exception';
import { AxiosError } from 'axios';

export class DiscordException extends HttpClientException {
    constructor(error: AxiosError) {
        super(error);
    }
}
