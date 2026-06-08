import { ApiProperty } from '@nestjs/swagger';
import { MessagePriority } from '../enums/message-priority.enum';
import { MessageStatus } from '../enums/message-status.enum';

export class MessageResponseDto {
    @ApiProperty({ description: 'Message ID' })
    id: number;

    @ApiProperty({ description: 'Conversation ID' })
    conversationId: number;

    @ApiProperty({ description: 'Message content' })
    content: string;

    @ApiProperty({ description: 'Message priority', enum: MessagePriority })
    priority: string;

    @ApiProperty({ description: 'Current message status', enum: MessageStatus })
    status: string;

    @ApiProperty({ description: 'Message cost in BRL' })
    cost: number;

    @ApiProperty({
        description: 'Remaining balance after deduction (prepaid only)',
        required: false,
    })
    currentBalance?: number;

    @ApiProperty({ description: 'Message timestamp' })
    timestamp: Date;
}
