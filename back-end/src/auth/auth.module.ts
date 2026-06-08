import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './useCase/login.use-case';
import { AuthRepository } from './auth.repository';
import { ClientsModule } from '../clients/clients.module';

@Module({
    imports: [ClientsModule],
    controllers: [AuthController],
    providers: [LoginUseCase, AuthRepository],
    exports: [AuthRepository],
})
export class AuthModule {}
