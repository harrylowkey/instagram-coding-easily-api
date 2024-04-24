/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HttpService } from '@nestjs/axios';
import camelcaseKeys from 'camelcase-keys';
import { firstValueFrom, map } from 'rxjs';
import axios, { AxiosRequestConfig } from 'axios';
import { HttpClientException } from '~core/exceptions/http-client.exception';
import { Logger } from '@nestjs/common';

export abstract class HttpBaseService {
    protected readonly httpClient: HttpService;
    private readonly logger = new Logger(HttpBaseService.name);

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

    public patch(url: string, data?: any, config: AxiosRequestConfig = {}) {
        return this.request({
            ...config,
            method: 'patch',
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

    // {
    //  message: 'The aspect ratio is not supported.',
    //  type: 'OAuthException',
    //  code: 36003,
    //  error_subcode: 2207009,
    //  is_transient: false,
    //  error_user_title: 'Invalid aspect ratio',
    //  error_user_msg: "The submitted image with aspect ratio ('717/209',) cannot be published. Please submit an image with a valid aspect ratio.",
    //  fbtrace_id: 'A64fo04Ql_J8awy5i6rs6so'
    // }

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
