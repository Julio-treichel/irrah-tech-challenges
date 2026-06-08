import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
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
import { ConversationResponseDto } from './dto/conversation-response.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateConversationUseCase } from './useCase/create-conversation.use-case';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('conversations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('conversations')
export class ConversationsController {
    constructor(
        private readonly createConversationUseCase: CreateConversationUseCase,
    ) {}

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
