import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { PlanType } from '../enums/plan-type.enum';
import { DocumentType } from '../enums/document-type.enum';

export class CreateClientDto {
    @ApiProperty({ description: 'The name of the client' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'CPF or CNPJ number (with or without mask)',
        example: '52998224725',
    })
    @IsString()
    @IsNotEmpty()
    documentId: string;

    @ApiProperty({
        description: 'The document type of the client',
        enum: DocumentType,
    })
    @IsEnum(DocumentType, { message: 'documentType must be CPF or CNPJ' })
    documentType: DocumentType;

    @ApiProperty({ description: 'The plan type of the client', enum: PlanType })
    @IsEnum(PlanType, { message: 'planType must be prepaid or postpaid' })
    planType: PlanType;

    @ApiProperty({
        description: 'Initial balance (prepaid only)',
        default: 0,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    balance?: number = 0;

    @ApiProperty({
        description: 'Monthly credit limit (postpaid only)',
        default: 0,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    creditLimit?: number = 0;

    @ApiProperty({
        description: 'Whether the client account is active',
        default: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    active?: boolean = true;
}
