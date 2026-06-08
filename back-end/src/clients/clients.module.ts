import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { CreateClientUseCase } from './useCase/create-client.use-case';
import { ClientsRepository } from './clients.repository';

@Module({
    controllers: [ClientsController],
    providers: [CreateClientUseCase, ClientsRepository],
    exports: [CreateClientUseCase, ClientsRepository],
})
export class ClientsModule {}
