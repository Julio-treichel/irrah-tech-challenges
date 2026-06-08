import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { CreateConversationUseCase } from './useCase/create-conversation.use-case';
import { ConversationsRepository } from './conversations.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ConversationsController],
    providers: [CreateConversationUseCase, ConversationsRepository],
})
export class ConversationsModule {}
