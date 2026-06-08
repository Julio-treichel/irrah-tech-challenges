import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ClientsRepository } from '../../clients/clients.repository';
import { MessagesRepository } from '../messages.repository';
import { MessageQueueService } from '../queue/message-queue.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { SendMessageResponseDto } from '../dto/send-message-response.dto';
import { MESSAGE_COST } from '../enums/message-priority.enum';
import { MessageStatus } from '../enums/message-status.enum';
import { PlanType } from '../../clients/enums/plan-type.enum';

@Injectable()
export class SendMessageUseCase {
    constructor(
        private readonly messagesRepository: MessagesRepository,
        private readonly clientsRepository: ClientsRepository,
        private readonly queueService: MessageQueueService,
        private readonly prisma: PrismaService,
    ) {}

    async execute(
        clientId: number,
        dto: SendMessageDto,
    ): Promise<SendMessageResponseDto> {
        const conversation =
            await this.messagesRepository.findConversationByIdAndClientId(
                dto.conversationId,
                clientId,
            );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        const client = await this.clientsRepository.findById(clientId);

        if (!client) {
            throw new NotFoundException('Client not found');
        }

        const cost = MESSAGE_COST[dto.priority];
        const planType = client.planType as PlanType;

        if (planType === PlanType.PREPAID) {
            if (client.balance < cost) {
                throw new HttpException(
                    `Insufficient balance. Required: R$${cost.toFixed(2)}, available: R$${client.balance.toFixed(2)}`,
                    HttpStatus.PAYMENT_REQUIRED,
                );
            }
        }

        if (planType === PlanType.POSTPAID) {
            const currentMonthlyUsage = client.balance;
            if (currentMonthlyUsage + cost > client.creditLimit) {
                throw new HttpException(
                    `Credit limit exceeded. Limit: R$${client.creditLimit.toFixed(2)}, used: R$${currentMonthlyUsage.toFixed(2)}`,
                    HttpStatus.PAYMENT_REQUIRED,
                );
            }
        }

        const newBalance =
            planType === PlanType.PREPAID
                ? client.balance - cost
                : client.balance + cost;

        const [, message] = await this.prisma.$transaction([
            this.prisma.clients.update({
                where: { id: clientId },
                data: { balance: newBalance },
            }),
            this.prisma.messages.create({
                data: {
                    conversationId: dto.conversationId,
                    content: dto.content,
                    sentById: clientId,
                    sentByType: 'client',
                    priority: dto.priority,
                    cost,
                    status: MessageStatus.QUEUED,
                },
            }),
        ]);

        this.queueService.enqueue({
            id: message.id,
            priority: dto.priority,
            timestamp: message.timestamp,
        });

        const estimatedDelivery = new Date(message.timestamp.getTime());

        return {
            id: message.id,
            status: message.status,
            timestamp: message.timestamp,
            estimatedDelivery,
            cost: message.cost,
            currentBalance:
                planType === PlanType.PREPAID ? newBalance : undefined,
        };
    }
}
