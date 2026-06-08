import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUseCase } from './useCase/login.use-case';
import { AuthRequestDto } from './dto/auth-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly loginUseCase: LoginUseCase) {}

    @ApiOperation({ summary: 'Authenticate with CPF or CNPJ' })
    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Authentication successful',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Client not found',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Inactive account or document type mismatch',
    })
    async login(@Body() dto: AuthRequestDto): Promise<AuthResponseDto> {
        try {
            return await this.loginUseCase.execute(dto);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Unexpected error during authentication',
            );
        }
    }
}
