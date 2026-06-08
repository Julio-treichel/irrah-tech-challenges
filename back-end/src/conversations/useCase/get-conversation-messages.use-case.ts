import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationsRepository } from '../conversations.repository';
import { MessageResponseDto } from '../../messages/dto/message-response.dto';

@Injectable()
export class GetConversationMessagesUseCase {
    constructor(
        private readonly conversationsRepository: ConversationsRepository,
    ) {}

    async execute(
        conversationId: number,
        clientId: number,
    ): Promise<MessageResponseDto[]> {
        const messages =
            await this.conversationsRepository.getMessagesByConversation(
                conversationId,
                clientId,
            );

        if (messages === null) {
            throw new NotFoundException('Conversation not found');
        }

        return messages;
    }
}
