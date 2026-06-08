import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DocumentType } from '../../clients/enums/document-type.enum';

export class AuthRequestDto {
    @ApiProperty({
        description: 'CPF or CNPJ number',
        example: '52998224725',
    })
    @IsString()
    @IsNotEmpty()
    documentId: string;

    @ApiProperty({ description: 'Document type', enum: DocumentType })
    @IsEnum(DocumentType, { message: 'documentType must be CPF or CNPJ' })
    documentType: DocumentType;
}
