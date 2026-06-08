import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../enums/document-type.enum';
import { PlanType } from '../enums/plan-type.enum';

export class ClientDto {
    @ApiProperty({ description: 'Client ID' })
    id: number;

    @ApiProperty({ description: 'Full name of the client' })
    name: string;

    @ApiProperty({ description: 'CPF or CNPJ number' })
    documentId: string;

    @ApiProperty({ description: 'Type of document', enum: DocumentType })
    documentType: string;

    @ApiProperty({ description: 'Billing plan', enum: PlanType })
    planType: string;

    @ApiProperty({ description: 'Current balance (prepaid only)' })
    balance: number;

    @ApiProperty({ description: 'Monthly credit limit (postpaid only)' })
    creditLimit: number;

    @ApiProperty({ description: 'Whether the client account is active' })
    active: boolean;

    @ApiProperty({ description: 'Account creation timestamp' })
    createdAt: Date;
}
