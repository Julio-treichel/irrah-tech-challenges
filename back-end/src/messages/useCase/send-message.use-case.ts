import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ClientsRepository } from '../../clients/clients.repository';
import { MessagesRepository } from '../messages.repository';
import { MessageQueueService } from '../queue/message-queue.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
import { MESSAGE_COST } from '../enums/message-priority.enum';

@Injectable()
export class SendMessageUseCase {
    constructor(
        private readonly messagesRepository: MessagesRepository,
        private readonly clientsRepository: ClientsRepository,
        private readonly queueService: MessageQueueService,
    ) {}

    async execute(
        clientId: number,
        dto: SendMessageDto,
    ): Promise<MessageResponseDto> {
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

        if (client.planType === 'prepaid') {
            if (client.balance < cost) {
                throw new HttpException(
                    `Insufficient balance. Required: R$${cost.toFixed(2)}, available: R$${client.balance.toFixed(2)}`,
                    HttpStatus.PAYMENT_REQUIRED,
                );
            }
            await this.clientsRepository.updateBalance(
                clientId,
                client.balance - cost,
            );
        }

        if (client.planType === 'postpaid') {
            const consumed = client.balance + cost;
            if (consumed > client.creditLimit) {
                throw new HttpException(
                    `Credit limit exceeded. Limit: R$${client.creditLimit.toFixed(2)}, used: R$${client.balance.toFixed(2)}`,
                    HttpStatus.PAYMENT_REQUIRED,
                );
            }
            await this.clientsRepository.updateBalance(clientId, consumed);
        }

        const message = await this.messagesRepository.create({
            conversationId: dto.conversationId,
            content: dto.content,
            sentById: clientId,
            priority: dto.priority,
            cost,
        });

        this.queueService.enqueue({
            id: message.id,
            priority: dto.priority,
            timestamp: message.timestamp,
        });

        return {
            ...message,
            currentBalance:
                client.planType === 'prepaid'
                    ? client.balance - cost
                    : undefined,
        };
    }
}
