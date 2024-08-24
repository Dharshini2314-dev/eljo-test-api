import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'departmentmaster' })
export class departmentmaster {
  @PrimaryGeneratedColumn({ name: 'departmentId' })
  departmentId: number;
  
  @Column({ name: 'departmentcode' })
  departmentcode: string;

  @Column({ name: 'departmentname' })
  departmentname: string;
  
}

@Entity({ name: 'employee' })
export class employee {
  @PrimaryGeneratedColumn({ name: 'employeeId' })
  employeeId: number;
  
  @Column({ name: 'employeecode' })
  employeecode: string;

  @Column({ name: 'firstname' })
  firstname: string;

  @Column({ name: 'lastname' })
  lastname: string;

  @Column({ name: 'departmentId' })
  departmentId: number;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'mobile' })
  mobile: string;

  @Column({ name: 'profileUrl' })
  profileUrl: string;
  
  @Column({ name: 'userId' })
  userId: number;
  
}

@Entity({ name: 'user' })
export class user {
  @PrimaryGeneratedColumn({ name: 'userId' })
  userId: number;
  
  @Column({ name: 'username' })
  username: string;

  @Column({ name: 'password' })
  password: string;
  
}

