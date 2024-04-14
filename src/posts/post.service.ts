import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ImageBuilder } from '~code2image/services/image-builder.service';
import { env } from '~config/env.config';

@Injectable()
export class PostService {
    #IMAGE_FOLDER = `${env.ROOT_PATH}/tmp`;

    getBadCode() {
        return `
	// Bad Practice: Misusing Any Type
	function getValue(data: any, key: string): any {
		return data[key];
	}

	const userData = {
		name: 'John',
		age: 30
	};

	// No type safety here
	// No error, but 'userName' can be of any type
	const userName = getValue(userData, 'name');

	// No error, but 'userAge' can be of any type
	const userAge = getValue(userData, 'age');

		`;
    }

    getGoodCode() {
        return `
	// Good Practice: Using Proper Types
	interface UserData {
		name: string;
		age: number;
	}

	function getValue<T, K extends keyof T>(data: T, key: K): T[K] {
		return data[key];
	}

	const userData: UserData = {
		name: 'John',
		age: 30
	};

	// Correctly inferred as string
	const userName: string = getValue(userData, 'name');

	// Correctly inferred as number
	const userAge: number = getValue(userData, 'age');

	// Error: Argument of type '"email"' is not assignable
	// to parameter of type '"name" | "age"'
	getValue(userData, 'email');

		`;
    }

    removeImages(imagePaths: string[]) {
        for (const imagePath of imagePaths) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                } else {
                    console.log('Image deleted successfully:', imagePath);
                }
            });
        }
    }

    saveImage(image: Buffer) {
        const filePath = `${this.#IMAGE_FOLDER}/${uuidv4()}.jpg`;

        fs.writeFile(filePath, image, (err) => {
            if (err) {
                console.error('Error writing image to disk:', err);
            } else {
                console.log('Image saved successfully to:', filePath);
            }
        });

        return filePath;
    }

    async generateImage(response: Response) {
        const params = {
            theme: 'nord',
            language: 'typescript'
        };

        const codes = [this.getBadCode(), this.getGoodCode()];
        const images = await Promise.all(
            codes.map((code) => new ImageBuilder(response, { ...params, code }).generateImage())
        );

        const imagePaths = await Promise.all(images.map((image) => this.saveImage(image)));

        return imagePaths;
    }
}
