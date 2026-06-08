import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    createSession(clientId: number): Promise<{ token: string }> {
        return this.prisma.sessions.create({
            data: { clientId },
            select: { token: true },
        });
    }

    findSessionByToken(token: string): Promise<{ clientId: number } | null> {
        return this.prisma.sessions.findUnique({
            where: { token },
            select: { clientId: true },
        });
    }
}
