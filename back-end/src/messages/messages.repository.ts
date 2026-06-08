import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
    }) {
        return this.prisma.messages.create({
            data: {
                ...data,
                sentByType: 'client',
                status: MessageStatus.QUEUED,
            },
        });
    }

    updateStatus(id: number, status: MessageStatus) {
        return this.prisma.messages.update({
            where: { id },
            data: { status },
        });
    }
}
