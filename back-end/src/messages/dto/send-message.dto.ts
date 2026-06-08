import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { MessagePriority } from '../enums/message-priority.enum';

export class SendMessageDto {
    @ApiProperty({ description: 'ID of the conversation' })
    @IsNumber()
    @Min(1)
    conversationId: number;

    @ApiProperty({ description: 'Message content' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        description: 'Message priority',
        enum: MessagePriority,
        default: MessagePriority.NORMAL,
    })
    @IsEnum(MessagePriority, { message: 'priority must be normal or urgent' })
    priority: MessagePriority;
}
