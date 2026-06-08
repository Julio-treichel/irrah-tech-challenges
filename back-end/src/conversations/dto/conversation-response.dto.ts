import { ApiProperty } from '@nestjs/swagger';

export class ConversationResponseDto {
    @ApiProperty({ description: 'The ID of the conversation' })
    id: number;

    @ApiProperty({ description: 'The ID of the client' })
    clientId: number;

    @ApiProperty({ description: 'The ID of the recipient' })
    recipientId: number;

    @ApiProperty({ description: 'The name of the recipient' })
    recipientName: string;

    @ApiProperty({
        description: 'Content of the last message in the conversation',
        nullable: true,
    })
    lastMessageContent: string | null;

    @ApiProperty({
        description: 'Timestamp of the last message',
        nullable: true,
    })
    lastMessageTime: Date | null;

    @ApiProperty({ description: 'Number of unread messages' })
    unreadCount: number;

    @ApiProperty({ description: 'The creation date of the conversation' })
    createdAt: Date;
}
