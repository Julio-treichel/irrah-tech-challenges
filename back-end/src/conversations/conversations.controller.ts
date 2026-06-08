import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateConversationUseCase } from './useCase/create-conversation.use-case';
import { GetConversationsUseCase } from './useCase/get-conversations.use-case';
import { GetConversationMessagesUseCase } from './useCase/get-conversation-messages.use-case';
import { MessageResponseDto } from '../messages/dto/message-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('conversations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('conversations')
export class ConversationsController {
    constructor(
        private readonly createConversationUseCase: CreateConversationUseCase,
        private readonly getConversationsUseCase: GetConversationsUseCase,
        private readonly getConversationMessagesUseCase: GetConversationMessagesUseCase,
    ) {}

    @ApiOperation({
        summary: 'List all conversations for the authenticated client',
    })
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of conversations',
        type: [ConversationResponseDto],
    })
    async getConversations(
        @Req() req: Request,
    ): Promise<ConversationResponseDto[]> {
        const clientId = req['clientId'] as number;
        return this.getConversationsUseCase.execute(clientId);
    }

    @ApiOperation({ summary: 'Get messages from a conversation' })
    @Get(':id/messages')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of messages in the conversation',
        type: [MessageResponseDto],
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Conversation not found',
    })
    async getConversationMessages(
        @Req() req: Request,
        @Param('id', ParseIntPipe) conversationId: number,
    ): Promise<MessageResponseDto[]> {
        try {
            const clientId = req['clientId'] as number;
            return await this.getConversationMessagesUseCase.execute(
                conversationId,
                clientId,
            );
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Unexpected error while fetching messages',
            );
        }
    }

    @ApiOperation({ summary: 'Create a new conversation' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Conversation created successfully',
        type: ConversationResponseDto,
    })
    async createConversation(
        @Req() req: Request,
        @Body() dto: CreateConversationDto,
    ): Promise<ConversationResponseDto> {
        try {
            const clientId = req['clientId'] as number;
            return await this.createConversationUseCase.execute(
                clientId,
                dto.recipientId,
            );
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Unexpected error while creating conversation',
            );
        }
    }
}
