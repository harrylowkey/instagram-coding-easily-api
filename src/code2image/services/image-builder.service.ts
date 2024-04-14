import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import chromium from 'chrome-aws-lambda';
import { themes } from '~/code2image/constants/theme';
import { languages } from '~/code2image/constants/languages';
import { env } from '~config/env.config';

@Injectable()
export class ImageBuilder {
    #FONTS: string[] = [
        'Inconsolata.ttf',
        'NotoColorEmoji.ttf',
        'FiraCode-Regular.ttf',
        'FiraCode-Bold.ttf',
        'DejaVuSansMono.ttf',
        'DejaVuSansMono-Bold.ttf',
        'UbuntuMono-Regular.ttf',
        'UbuntuMono-Bold.ttf',
        'RobotoMono-Bold.ttf',
        'RobotoMono-Regular.ttf'
    ];
    #DEFAULTS = {
        VIEWPORT: {
            WIDTH: 1080,
            HEIGHT: 1080,
            DEVICE_SCALE_FACTOR: 1
        },
        INDEX_PAGE: 'preview.html'
    };
    #WIDTH: number = this.#DEFAULTS.VIEWPORT.WIDTH;
    #SCALE_FACTOR: number = this.#DEFAULTS.VIEWPORT.DEVICE_SCALE_FACTOR;
    #BACKGROUND_COLOR: any = 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)';
    #BACKGROUND_PADDING: string | number = '5';
    #BACKGROUND_IMAGE: string = '';
    #IS_SHOW_BACKGROUND: string | boolean = '';
    #HOSTNAME: string = env.BACKEND_URL;
    #PAGE_URL: string = '';

    constructor(
        private response: Response,
        private params: any
    ) {
        this.response = response;
        this.params = params;
    }

    #sendErrorResponse(response: any, responseObject: any): void {
        response.status(400);
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.json(responseObject);
    }

    #trimLineEndings(text: string): string {
        let trimmedText = text;
        if (text && typeof text === 'string') {
            trimmedText = text
                .split('\n')
                .map((line) => line.trimEnd())
                .join('\n');
        }
        return trimmedText;
    }

    #validateLanguage(language: string): this {
        if (!language || languages.indexOf(language) === -1) {
            console.log('❌ ', !language ? 'Language not specified' : `Unknown language '${language}'`);
            this.#sendErrorResponse(this.response, {
                message: !language ? 'language missing: please specify a language' : `Unknown language '${language}'`,
                availableLanguages: languages
            });
            return this;
        }

        return this;
    }

    #validateTheme(theme: string): this {
        if (themes.indexOf(theme) === -1) {
            console.log('❌ ', `Unknown theme '${theme}'`);
            this.#sendErrorResponse(this.response, {
                message: `Unknown theme: '${theme}'`,
                availableThemes: themes
            });
            return this;
        }

        return this;
    }

    #setBackgroundPadding(customizeBackgroundPadding?: string): this {
        try {
            const padding = parseInt(customizeBackgroundPadding || (this.#BACKGROUND_PADDING as string));
            this.#BACKGROUND_PADDING = Math.min(Math.max(0, padding), 10); // Make sure number is in range between 1-10
        } catch (error) {
            this.#BACKGROUND_PADDING = '';
        }

        return this;
    }

    #setScaleFactor(customizeScale?: number): this {
        try {
            const scaleFactor = customizeScale || this.#DEFAULTS.VIEWPORT.DEVICE_SCALE_FACTOR;
            this.#SCALE_FACTOR = Math.min(Math.max(1, scaleFactor), 5); // Make sure number is in range between 1-5
        } catch (e) {
            this.#SCALE_FACTOR = this.#DEFAULTS.VIEWPORT.DEVICE_SCALE_FACTOR;
        }

        return this;
    }

    #setWidth(customizeWidth?: number): this {
        try {
            const width = customizeWidth || this.#DEFAULTS.VIEWPORT.WIDTH;
            this.#WIDTH = Math.min(Math.abs(width), 1920);
        } catch (e) {
            this.#WIDTH = this.#DEFAULTS.VIEWPORT.WIDTH;
        }

        return this;
    }

    #generatePreviewUrl(
        code: string,
        theme: string,
        language: string,
        lineNumbers: boolean,
        showBackground: boolean
    ): void {
        const queryParams = new URLSearchParams();

        const trimmedCodeSnippet: string = this.#trimLineEndings(code);
        const isShowBackground = showBackground ? 'true' : 'false';

        theme && queryParams.set('theme', theme);
        language && queryParams.set('language', language);

        queryParams.set('code', trimmedCodeSnippet);
        queryParams.set('padding', this.#BACKGROUND_PADDING as string);
        queryParams.set('background-image', this.#BACKGROUND_IMAGE);
        queryParams.set('background-color', this.#BACKGROUND_COLOR);
        queryParams.set('line-numbers', lineNumbers ? 'true' : 'false');
        queryParams.set('show-background', isShowBackground);

        const queryParamsString = queryParams.toString();
        this.#PAGE_URL = `${this.#HOSTNAME}/preview.html?${queryParamsString}`;
        this.#IS_SHOW_BACKGROUND = isShowBackground;
    }

    #setResponse(image: Buffer | string | void): void {
        this.response.status(200);
        this.response.setHeader('Content-Type', 'image/png');
        this.response.setHeader('Access-Control-Allow-Origin', '*');
        this.response.send(image);
    }

    async #loadFonts(): Promise<void> {
        await Promise.all(
            this.#FONTS.map(async (font) => {
                const fontUrl = `https://raw.githack.com/cyberpirate92/code2img/master/public/fonts/${font}`;
                await chromium.font(fontUrl);
            })
        );
    }

    async #generatePreviewImage(): Promise<Buffer> {
        console.log('🛠 ', 'Preview Page URL', this.#PAGE_URL);
        const browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true
        });

        const page = await browser.newPage();
        await page.goto(this.#PAGE_URL, {
            waitUntil: 'networkidle2'
        });

        // set window header background same as the body
        await page.evaluate(() => {
            let background = '';
            const codeContainer = document.getElementById('code-container');
            const windowHeader = document.getElementById('header');
            if (codeContainer && windowHeader) {
                background = window.getComputedStyle(codeContainer, null).getPropertyValue('background');
                windowHeader.style.background = background;
            }
            return background;
        });

        console.log({
            deviceScaleFactor: this.#SCALE_FACTOR,
            width: this.#WIDTH,
            height: this.#DEFAULTS.VIEWPORT.HEIGHT,
            isMobile: true
        });

        await page.setViewport({
            deviceScaleFactor: this.#SCALE_FACTOR,
            width: this.#WIDTH,
            height: this.#DEFAULTS.VIEWPORT.HEIGHT,
            isMobile: true
        });

        const codeView = await page.$(this.#IS_SHOW_BACKGROUND ? '#container' : '#window');
        const image = (await codeView.screenshot()) as Buffer;

        // this.#setResponse(image);

        await page.close();
        await browser.close();

        return image;
    }

    async generateImage(): Promise<Buffer> {
        const {
            code,
            theme,
            language,
            lineNumbers,
            showBackground,
            customizeScale,
            customizeWidth,
            customizeBackgroundPadding
        } = this.params;

        this.#validateLanguage(language)
            .#validateTheme(theme)
            .#setBackgroundPadding(customizeBackgroundPadding)
            .#setScaleFactor(customizeScale)
            .#setWidth(customizeWidth)
            .#generatePreviewUrl(code, theme, language, lineNumbers, showBackground);

        await this.#loadFonts();
        return await this.#generatePreviewImage();
    }
}
