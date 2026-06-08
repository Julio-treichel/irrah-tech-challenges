import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ClientsRepository } from '../../clients/clients.repository';
import { AuthRepository } from '../auth.repository';
import { AuthRequestDto } from '../dto/auth-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class LoginUseCase {
    constructor(
        private readonly clientsRepository: ClientsRepository,
        private readonly authRepository: AuthRepository,
    ) {}

    async execute(dto: AuthRequestDto): Promise<AuthResponseDto> {
        const client = await this.clientsRepository.findByDocument(
            dto.documentId,
        );

        if (!client) {
            throw new NotFoundException('Client not found');
        }

        if (client.documentType !== dto.documentType.toString()) {
            throw new UnauthorizedException('Document type does not match');
        }

        if (!client.active) {
            throw new UnauthorizedException('Client account is inactive');
        }

        const session = await this.authRepository.createSession(client.id);

        return { token: session.token, client };
    }
}
