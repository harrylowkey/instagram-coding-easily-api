import { Injectable } from '@nestjs/common';
import { env } from '~config/env.config';
import { HttpBaseService } from '~http-client/services/http-base.service';

@Injectable()
export class GraphFacebookService extends HttpBaseService {
    public constructor() {
        super();
        this.configBaseURL('https://graph.facebook.com/v19.0');
        this.configParams({
            access_token: env.FACEBOOK.ACCESS_TOKEN
        });
    }
}
