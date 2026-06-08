import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientDto } from './dto/client-response.dto';

@Injectable()
export class ClientsRepository {
    constructor(private readonly prisma: PrismaService) {}

    findById(id: number): Promise<ClientDto | null> {
        return this.prisma.clients.findUnique({ where: { id } });
    }

    findByDocument(documentId: string): Promise<ClientDto | null> {
        return this.prisma.clients.findUnique({ where: { documentId } });
    }

    createNewClient(createClientDto: CreateClientDto): Promise<ClientDto> {
        return this.prisma.clients.create({ data: createClientDto });
    }

    updateBalance(id: number, balance: number): Promise<ClientDto> {
        return this.prisma.clients.update({ where: { id }, data: { balance } });
    }
}
