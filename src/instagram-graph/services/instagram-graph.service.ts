import snakecase from 'snakecase-keys';

import { AxiosRequestConfig } from 'axios';
import { env } from '~config/env.config';
import { HttpBaseService } from '~http-client/services/http-base.service';
import { CreateContainerType } from '~instagram-graph/types/create-container.type';
import { ContainerType } from '~instagram-graph/types/container.type';
import { MediaTypeEnum } from '~instagram-graph/enums/container-media-type.enum';
import { UploadSimplePostType } from '~instagram-graph/types/upload-simple-post.type';
import { UploadCarouselPostType } from '~instagram-graph/types/upload-carousel-post.type';

export class InstagramGraphService extends HttpBaseService {
    /* eslint-disable @typescript-eslint/naming-convention */
    #accessTokenHeader = { access_token: env.FACEBOOK.ACCESS_TOKEN };

    constructor() {
        super();
        this.configBaseURL(`https://graph.facebook.com/v19.0/${env.INSTAGRAM.ACCOUNT_ID}`);
    }

    /* eslint-disable @typescript-eslint/explicit-function-return-type */
    #post(url: string, config: AxiosRequestConfig = {}) {
        config.params = { ...this.#accessTokenHeader, ...config.params };
        return this.post(url, {}, config);
    }

    #createContainer(params: CreateContainerType): Promise<ContainerType> {
        return this.#post('/media', { params: snakecase(params) });
    }

    #createCarouselContainer(children: string[], caption: string = ''): Promise<ContainerType> {
        const params = { children: children.join(','), mediaType: MediaTypeEnum.CAROUSEL, caption };
        return this.#post('/media', { params: snakecase(params) });
    }

    #publishContainer(containerId: string): Promise<ContainerType> {
        return this.#post('/media_publish', { params: snakecase({ creationId: containerId }) });
    }

    async uploadSimplePost(params: UploadSimplePostType): Promise<ContainerType> {
        const container = await this.#createContainer(params);
        return this.#publishContainer(container.id);
    }

    async uploadCarouselPost(params: UploadCarouselPostType): Promise<ContainerType> {
        const containers = await Promise.all(params.imageUrls.map((imageUrl) => this.#createContainer({ imageUrl })));
        const carouselContainer = await this.#createCarouselContainer(
            containers.map((container) => container.id),
            params.caption
        );
        return this.#publishContainer(carouselContainer.id);
    }
}
