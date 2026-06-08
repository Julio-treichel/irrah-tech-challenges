import {
    BadRequestException,
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { ClientsRepository } from '../clients.repository';
import { CreateClientDto } from '../dto/create-client.dto';
import { ClientDto } from '../dto/client-response.dto';
import { DocumentType } from '../enums/document-type.enum';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@Injectable()
export class CreateClientUseCase {
    constructor(private readonly clientsRepository: ClientsRepository) {}

    async execute(dto: CreateClientDto): Promise<ClientDto> {
        const noMaskDocument = dto.documentId.replace(/\D/g, '');

        if (!this.isValidDocument(noMaskDocument, dto.documentType)) {
            throw new BadRequestException('Document is not valid');
        }

        const existing =
            await this.clientsRepository.findByDocument(noMaskDocument);

        if (existing) {
            throw new ConflictException(`Client already exists`);
        }

        return this.clientsRepository.createNewClient({
            ...dto,
            documentId: noMaskDocument,
        });
    }

    private isValidDocument(
        document: string,
        documentType: DocumentType,
    ): boolean {
        if (documentType === DocumentType.CPF) {
            return cpf.isValid(document);
        }
        if (documentType === DocumentType.CNPJ) {
            return cnpj.isValid(document);
        }

        return false;
    }
}
