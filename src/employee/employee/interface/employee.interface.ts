import { authLogin, emplTable, newemployee } from "../dto/employee.dto";

export const EMPLOYEE_SERVICE = 'EMPLOYEE_SERVICE';

export interface IEmployeeService {
    department_list(id: number): Promise<any>;
    new_employee(dto: newemployee): Promise<any>;
    fetch_employee(dto: emplTable): Promise<any>;
    auth_login(dto: authLogin): Promise<any>;
    delete_employee(id: number): Promise<any>;
    profile_update(dto: newemployee): Promise<any>;
}