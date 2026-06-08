import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
    Logger,
} from '@nestjs/common';
import { MessagesRepository } from '../messages.repository';
import { MessageQueueService } from './message-queue.service';
import { MessageStatus } from '../enums/message-status.enum';

@Injectable()
export class MessageWorkerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(MessageWorkerService.name);
    private isRunning = false;

    constructor(
        private readonly queueService: MessageQueueService,
        private readonly messagesRepository: MessagesRepository,
    ) {}

    onModuleInit(): void {
        this.isRunning = true;
        void this.processQueue();
    }

    onModuleDestroy(): void {
        this.isRunning = false;
    }

    private async processQueue(): Promise<void> {
        while (this.isRunning) {
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
