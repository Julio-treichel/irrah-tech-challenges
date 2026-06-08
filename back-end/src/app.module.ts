import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';

@Module({
    imports: [
        PrismaModule,
        ClientsModule,
        AuthModule,
        MessagesModule,
        ConversationsModule,
    ],
})
export class AppModule {}
