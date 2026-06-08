import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateConversationDto {
    @ApiProperty({ description: 'The ID of the recipient' })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    recipientId: number;
}
