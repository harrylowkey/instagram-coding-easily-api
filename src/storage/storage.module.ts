import { Global, Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';

@Global()
@Module({
    providers: [StorageService],
    exports: [StorageService],
    controllers: []
})
export class StorageModule {}
