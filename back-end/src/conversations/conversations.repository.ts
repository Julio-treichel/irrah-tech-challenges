import { PrismaService } from '../prisma/prisma.service';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationsRepository {
    constructor(private readonly prisma: PrismaService) {}
    createConversation(
        clientId: number,
        recipientId: number,
    ): Promise<ConversationResponseDto> {
        return this.prisma.conversations.create({
            data: {
                clientId,
                recipientId,
            },
        });
    }
}
