import { Role } from 'src/role/entity/role.entity';

export class CreateUserDTO {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role_id: string;
}