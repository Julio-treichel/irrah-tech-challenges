import { PrismaService } from '../prisma/prisma.service';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { MessageResponseDto } from '../messages/dto/message-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createConversation(
        clientId: number,
        recipientId: number,
    ): Promise<ConversationResponseDto> {
        const conv = await this.prisma.conversations.create({
            data: { clientId, recipientId },
            include: { recipient: true },
        });

        return {
            id: conv.id,
            clientId: conv.clientId,
            recipientId: conv.recipientId,
            recipientName: conv.recipient.name,
            lastMessageContent: null,
            lastMessageTime: null,
            unreadCount: 0,
            createdAt: conv.createdAt,
        };
    }

    async findByClientId(clientId: number): Promise<ConversationResponseDto[]> {
        const conversations = await this.prisma.conversations.findMany({
            where: { clientId },
            include: {
                recipient: true,
                messages: {
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return conversations.map((conv) => ({
            id: conv.id,
            clientId: conv.clientId,
            recipientId: conv.recipientId,
            recipientName: conv.recipient.name,
            lastMessageContent: conv.messages[0]?.content ?? null,
            lastMessageTime: conv.messages[0]?.timestamp ?? null,
            unreadCount: 0,
            createdAt: conv.createdAt,
        }));
    }

    async getMessagesByConversation(
        conversationId: number,
        clientId: number,
    ): Promise<MessageResponseDto[] | null> {
        const conversation = await this.prisma.conversations.findFirst({
            where: { id: conversationId, clientId },
        });

        if (!conversation) return null;

        const messages = await this.prisma.messages.findMany({
            where: { conversationId },
            orderBy: { timestamp: 'asc' },
        });

        return messages.map((msg) => ({
            id: msg.id,
            conversationId: msg.conversationId,
            content: msg.content,
            sentBy: {
                id: msg.sentById,
                type: msg.sentByType,
            },
            priority: msg.priority,
            status: msg.status,
            cost: msg.cost,
            timestamp: msg.timestamp,
        }));
    }
}
