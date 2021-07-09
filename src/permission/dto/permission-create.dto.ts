import { IsNotEmpty } from 'class-validator';

export class PermissionCreateDTO{
    @IsNotEmpty()
    name?: string;
}