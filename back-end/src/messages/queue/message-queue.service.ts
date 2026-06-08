import { Injectable } from '@nestjs/common';
import { MessagePriority } from '../enums/message-priority.enum';

export interface QueuedMessage {
    id: number;
    priority: MessagePriority;
    timestamp: Date;
}

@Injectable()
export class MessageQueueService {
    private readonly queue: QueuedMessage[] = [];

    enqueue(message: QueuedMessage): void {
        this.queue.push(message);

        this.queue.sort((a, b) => {
            if (
                a.priority === MessagePriority.URGENT &&
                b.priority === MessagePriority.NORMAL
            )
                return -1;
            if (
                a.priority === MessagePriority.NORMAL &&
                b.priority === MessagePriority.URGENT
            )
                return 1;
            return a.timestamp.getTime() - b.timestamp.getTime();
        });
    }

    dequeue(): QueuedMessage | undefined {
        return this.queue.shift();
    }

    getQueue(): QueuedMessage[] {
        return [...this.queue];
    }

    get length(): number {
        return this.queue.length;
    }
}
