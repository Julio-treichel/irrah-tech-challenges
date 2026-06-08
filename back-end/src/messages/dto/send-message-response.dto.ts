import { ApiProperty } from '@nestjs/swagger';

export class SendMessageResponseDto {
    @ApiProperty({ description: 'Message ID' })
    id: number;

    @ApiProperty({ description: 'Status after queuing', example: 'queued' })
    status: string;

    @ApiProperty({ description: 'Message timestamp' })
    timestamp: Date;

    @ApiProperty({ description: 'Estimated delivery time' })
    estimatedDelivery: Date;

    @ApiProperty({ description: 'Message cost in BRL' })
    cost: number;

    @ApiProperty({
        description: 'Remaining balance after deduction (prepaid only)',
        required: false,
        nullable: true,
    })
    currentBalance?: number;
}
