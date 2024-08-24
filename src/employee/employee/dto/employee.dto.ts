import { ApiProperty } from '@nestjs/swagger';
import {
  isEmail,
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  isNumber,
  IsNumberString,
  isNumberString,
  IsOptional,
} from 'class-validator';
import { Timestamp } from 'rxjs';

export class newemployee{
    @ApiProperty()
    employee_id: Number;
    @ApiProperty()
    employee_code: string;
    @ApiProperty()
    first_name: string;
    @ApiProperty()
    lastname: string;
    @ApiProperty()
    departmentId : number;
    @ApiProperty()
    email : string;
    @ApiProperty()
    mobile : string;
    @ApiProperty()
    userName: string;
    @ApiProperty()
    profileImage:string
}

export class emplTable
{
  @ApiProperty()
  department_id: number;
  @ApiProperty()
  searchTerm: string;
  @ApiProperty()
  sortColumn: string;
  @ApiProperty()
  sortOrder: string;
  @ApiProperty()
  pageNumber: number;
  @ApiProperty()
  pageSize:number
}

export class authLogin{
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}