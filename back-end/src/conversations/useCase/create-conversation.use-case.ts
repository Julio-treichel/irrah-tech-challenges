import { Injectable } from '@nestjs/common';
import { ConversationResponseDto } from '../dto/conversation-response.dto';
import { ConversationsRepository } from '../conversations.repository';

@Injectable()
export class CreateConversationUseCase {
    constructor(
        private readonly conversationsRepository: ConversationsRepository,
    ) {}

    async execute(
        clientId: number,
        recipientId: number,
    ): Promise<ConversationResponseDto> {
        return this.conversationsRepository.createConversation(
            clientId,
            recipientId,
        );
    }
}
