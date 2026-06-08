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
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { SendMessageUseCase } from './useCase/send-message.use-case';
import { SendMessageDto } from './dto/send-message.dto';
import { SendMessageResponseDto } from './dto/send-message-response.dto';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('messages')
export class MessagesController {
    constructor(private readonly sendMessageUseCase: SendMessageUseCase) {}

    @ApiOperation({ summary: 'Send a message (requires authentication)' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Message queued successfully',
        type: SendMessageResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Conversation not found',
    })
    @ApiResponse({
        status: HttpStatus.PAYMENT_REQUIRED,
        description: 'Insufficient balance or credit limit exceeded',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Missing or invalid token',
    })
    async sendMessage(
        @Req() req: Request,
        @Body() dto: SendMessageDto,
    ): Promise<SendMessageResponseDto> {
        try {
            const clientId = req['clientId'] as number;
            return await this.sendMessageUseCase.execute(clientId, dto);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Unexpected error while sending message',
            );
        }
    }
}
