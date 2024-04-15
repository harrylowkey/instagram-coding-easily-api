import { HttpService } from '@nestjs/axios';
import Axios, { AxiosRequestConfig } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { firstValueFrom, map } from 'rxjs';
import { HttpClientException } from '~core/exceptions/http-client.exception';

export abstract class HttpBaseService {
    protected readonly httpClient: HttpService;

    public constructor() {
        this.httpClient = new HttpService(Axios.create());
    }

    protected configBaseURL(url: string): void {
        this.httpClient.axiosRef.defaults.baseURL = url;
    }

    protected configParams(params: any): void {
        this.httpClient.axiosRef.defaults.params = params;
    }

    protected configHeaders(headers: any): void {
        this.httpClient.axiosRef.defaults.headers = headers;
    }

    public get(url: string, config: AxiosRequestConfig = {}) {
        return this.request({
            ...config,
            method: 'GET',
            url
        });
    }

    public post(url: string, data: any, config: AxiosRequestConfig = {}) {
        return this.request({
            ...config,
            method: 'POST',
            url,
            data
        });
    }

    public request(config: AxiosRequestConfig = {}) {
        try {
            return firstValueFrom(
                this.httpClient.request(config).pipe(map((response) => camelcaseKeys(response.data, { deep: true })))
            );
        } catch (error) {
            throw new HttpClientException(error);
        }
    }
}
