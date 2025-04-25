import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL; // Load from .env
const EMPLOYEE_API_BASE_URL = `${BASE_URL}/employees`;

// Define Employee interface
export interface Employee {
    id?: number;
    firstName: string;
    lastName: string;
    emailId: string;
}

class EmployeeService {
    
    getEmployees() {
        return axios.get<Employee[]>(EMPLOYEE_API_BASE_URL)
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching employees:", error);
                throw error;
            });
    }

    createEmployee(employee: Employee) {
        return axios.post<Employee>(EMPLOYEE_API_BASE_URL, employee)
            .then(response => response.data)
            .catch(error => {
                console.error("Error creating employee:", error);
                throw error;
            });
    }

    getEmployeeById(employeeId: number) {
        return axios.get<Employee>(`${EMPLOYEE_API_BASE_URL}/${employeeId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Error fetching employee with ID ${employeeId}:`, error);
                throw error;
            });
    }

    updateEmployee(employee: Employee, employeeId: number) {
        return axios.put<Employee>(`${EMPLOYEE_API_BASE_URL}/${employeeId}`, employee)
            .then(response => response.data)
            .catch(error => {
                console.error(`Error updating employee with ID ${employeeId}:`, error);
                throw error;
            });
    }

    deleteEmployee(employeeId: number) {
        return axios.delete(`${EMPLOYEE_API_BASE_URL}/${employeeId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Error deleting employee with ID ${employeeId}:`, error);
                throw error;
            });
    }
}

export default new EmployeeService();
