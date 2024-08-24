import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from '../employee.controller';
import { EmployeeService } from '../employee.service';
import { EMPLOYEE_SERVICE } from './interface/employee.interface';

import {
    departmentmaster,employee,
    user
} from './dbentity/employee.entity';

import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([departmentmaster,employee,user]),
  ],
  providers: [
    { useClass: EmployeeService, provide: EMPLOYEE_SERVICE },
    EmployeeService,
    ConfigService,
    JwtService,
    Repository,
  ],
  controllers: [EmployeeController],
  exports: [],
})

export class EmployeeModule {}
