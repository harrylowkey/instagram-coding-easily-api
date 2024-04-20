import { HttpService } from '@nestjs/axios';
import camelcaseKeys from 'camelcase-keys';
import { firstValueFrom, map } from 'rxjs';
import axios, { AxiosRequestConfig } from 'axios';
import { HttpClientException } from '~core/exceptions/http-client.exception';

export abstract class HttpBaseService {
    protected readonly httpClient: HttpService;

    public constructor() {
        this.httpClient = new HttpService(axios.create());
    }

    protected configBaseURL(url: string): void {
        this.httpClient.axiosRef.defaults.baseURL = url;
    }

    protected configHeaders(headers: any): void {
        this.httpClient.axiosRef.defaults.headers = headers;
    }

    public get(url: string, config: AxiosRequestConfig = {}) {
        return this.request({
            ...config,
            method: 'get',
            url
        });
    }

    public post(url: string, data?: any, config: AxiosRequestConfig = {}) {
        return this.request({
            ...config,
            method: 'post',
            url,
            data
        });
    }

    public put(url: string, data?: any, config: AxiosRequestConfig = {}) {
        return this.request({
            ...config,
            method: 'put',
            url,
            data
        });
    }

    public delete(url: string, config: AxiosRequestConfig = {}) {
        return this.request({
            ...config,
            method: 'delete',
            url
        });
    }

    public async request(config: AxiosRequestConfig = {}) {
        try {
            return await firstValueFrom(
                this.httpClient.request(config).pipe(map((response) => camelcaseKeys(response.data, { deep: true })))
            );
        } catch (error) {
            console.log(error);
            throw new HttpClientException(error);
        }
    }
}
