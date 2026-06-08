import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    HttpException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateClientUseCase } from './useCase/create-client.use-case';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientDto } from './dto/client-response.dto';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
    constructor(private readonly createClientUseCase: CreateClientUseCase) {}

    @ApiOperation({ summary: 'Create a new client' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Client created successfully',
        type: ClientDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'A client with this documentId already exists',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request body',
    })
    async createClient(
        @Body() createClientDto: CreateClientDto,
    ): Promise<ClientDto> {
        try {
            return await this.createClientUseCase.execute(createClientDto);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Unexpected error while creating client',
            );
        }
    }
}
