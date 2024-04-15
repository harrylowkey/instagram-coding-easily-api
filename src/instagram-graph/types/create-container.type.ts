import { MediaTypeEnum } from '~instagram-graph/enums/container-media-type.enum';

export type CreateContainerType = {
    caption?: string;
    mediaType?: MediaTypeEnum;
    isCarouselItem?: boolean;
    videoUrl?: string;
    imageUrl?: string;
};
