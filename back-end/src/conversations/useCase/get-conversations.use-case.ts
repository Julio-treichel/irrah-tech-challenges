import { Injectable } from '@nestjs/common';
import { ConversationsRepository } from '../conversations.repository';
import { ConversationResponseDto } from '../dto/conversation-response.dto';

@Injectable()
export class GetConversationsUseCase {
    constructor(
        private readonly conversationsRepository: ConversationsRepository,
    ) {}

    execute(clientId: number): Promise<ConversationResponseDto[]> {
        return this.conversationsRepository.findByClientId(clientId);
    }
}
