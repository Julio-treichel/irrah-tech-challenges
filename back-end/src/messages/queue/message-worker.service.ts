import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { MessagesRepository } from '../messages.repository';
import { MessageQueueService } from './message-queue.service';
import { MessageStatus } from '../enums/message-status.enum';

@Injectable()
export class MessageWorkerService implements OnModuleInit {
    private readonly logger = new Logger(MessageWorkerService.name);

    constructor(
        private readonly queueService: MessageQueueService,
        private readonly messagesRepository: MessagesRepository,
    ) {}

    onModuleInit(): void {
        void this.processQueue();
    }

    private async processQueue(): Promise<void> {
        while (true) {
            const item = this.queueService.dequeue();

            if (item) {
                try {
                    await this.messagesRepository.updateStatus(
                        item.id,
                        MessageStatus.PROCESSING,
                    );
                    await this.simulateDelivery();
                    await this.messagesRepository.updateStatus(
                        item.id,
                        MessageStatus.SENT,
                    );
                    this.logger.log(
                        `Message ${item.id} (${item.priority}) delivered`,
                    );
                } catch {
                    await this.messagesRepository.updateStatus(
                        item.id,
                        MessageStatus.FAILED,
                    );
                    this.logger.error(`Message ${item.id} failed`);
                }
            } else {
                await this.sleep(500);
            }
        }
    }

    private simulateDelivery(): Promise<void> {
        return this.sleep(1000);
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
