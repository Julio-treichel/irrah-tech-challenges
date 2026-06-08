import { ApiProperty } from '@nestjs/swagger';
import { ClientDto } from '../../clients/dto/client-response.dto';

export class AuthResponseDto {
    @ApiProperty({ description: 'Session token for subsequent requests' })
    token: string;

    @ApiProperty({ description: 'Authenticated client data', type: ClientDto })
    client: ClientDto;
}
