import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessageStatus } from './enums/message-status.enum';
import { MessagePriority } from './enums/message-priority.enum';

@Injectable()
export class MessagesRepository {
    constructor(private readonly prisma: PrismaService) {}

    findConversationByIdAndClientId(conversationId: number, clientId: number) {
        return this.prisma.conversations.findFirst({
            where: { id: conversationId, clientId },
        });
    }

    create(data: {
        conversationId: number;
        content: string;
        sentById: number;
        priority: MessagePriority;
        cost: number;
    }): Promise<MessageResponseDto> {
        return this.prisma.messages.create({
            data: {
                ...data,
                sentByType: 'client',
                status: MessageStatus.QUEUED,
            },
        });
    }

    updateStatus(
        id: number,
        status: MessageStatus,
    ): Promise<MessageResponseDto> {
        return this.prisma.messages.update({
            where: { id },
            data: { status },
        });
    }

    findByConversation(conversationId: number): Promise<MessageResponseDto[]> {
        return this.prisma.messages.findMany({
            where: { conversationId },
            orderBy: [{ priority: 'asc' }, { timestamp: 'asc' }],
        });
    }
}
