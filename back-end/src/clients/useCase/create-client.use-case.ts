import {
    BadRequestException,
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { ClientsRepository } from '../clients.repository';
import { CreateClientDto } from '../dto/create-client.dto';
import { ClientDto } from '../dto/client-response.dto';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@Injectable()
export class CreateClientUseCase {
    constructor(private readonly clientsRepository: ClientsRepository) {}

    async execute(dto: CreateClientDto): Promise<ClientDto> {
        const validatedDocument = this.isValidDocument(
            dto.documentId,
            dto.documentType,
        );

        if (!validatedDocument) {
            throw new BadRequestException('Document is not valid');
        }

        const existing = await this.clientsRepository.findByDocument(
            dto.documentId,
        );

        if (existing) {
            throw new ConflictException(`Client already exists`);
        }

        return this.clientsRepository.createNewClient(dto);
    }

    private isValidDocument(document: string, documentType: string): boolean {
        const noMaskDocument = document.replace(/\D/g, '');

        if (documentType === 'CPF') {
            return cpf.isValid(noMaskDocument);
        }
        if (documentType === 'CNPJ') {
            return cnpj.isValid(noMaskDocument);
        }

        return false;
    }
}
