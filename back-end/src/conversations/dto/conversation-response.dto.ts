import { ApiProperty } from '@nestjs/swagger';

export class ConversationResponseDto {
    @ApiProperty({ description: 'The ID of the conversation' })
    id: number;

    @ApiProperty({ description: 'The ID of the client' })
    clientId: number;

    @ApiProperty({ description: 'The ID of the recipient' })
    recipientId: number;

    @ApiProperty({ description: 'The creation date of the conversation' })
    createdAt: Date;
}
