import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { SendMessageUseCase } from './useCase/send-message.use-case';
import { MessagesRepository } from './messages.repository';
import { MessageQueueService } from './queue/message-queue.service';
import { MessageWorkerService } from './queue/message-worker.service';
import { ClientsModule } from '../clients/clients.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [ClientsModule, AuthModule],
    controllers: [MessagesController],
    providers: [
        SendMessageUseCase,
        MessagesRepository,
        MessageQueueService,
        MessageWorkerService,
    ],
})
export class MessagesModule {}
