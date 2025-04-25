import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

// Define Employee interface
interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    emailId: string;
}

const ListEmployeeComponent: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        EmployeeService.getEmployees()
            .then((res) => {
                if (res) {
                    setEmployees(res);
                } else {
                    setEmployees([]); // Ensure state is always an array
                }
            })
            .catch((error) => {
                console.error("Error fetching employees:", error);
                setEmployees([]); // Handle error by setting an empty array
            });
    }, []);
    
    const addEmployee = () => navigate('/add-employee/_add');
    const editEmployee = (id: number) => navigate(`/add-employee/${id}`);
    const viewEmployee = (id: number) => navigate(`/view-employee/${id}`);

    const deleteEmployee = (id: number) => {
        EmployeeService.deleteEmployee(id).then(() => {
            setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
        }).catch(error => {
            console.error("Error deleting employee:", error);
        });
    };

    return (
        <div className='p-5'>
           
            <div className="row flex justify-end ">
                <button className="bg-blue-500 p-2 rounded-lg" onClick={addEmployee}> Add Employee</button>
            </div>
            <br />
            <div className="row">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th> Employee First Name</th>
                            <th> Employee Last Name</th>
                            <th> Employee Email Id</th>
                            <th> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                      
                            {employees?.length > 0 ? (
                                employees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td> {employee.firstName} </td>
                                        <td> {employee.lastName}</td>
                                        <td> {employee.emailId}</td>
                                        <td>
                                            <button onClick={() => editEmployee(employee.id!)} className="btn btn-info">Update</button>
                                            <button style={{ marginLeft: "10px" }} onClick={() => deleteEmployee(employee.id!)} className="btn btn-danger">Delete</button>
                                            <button style={{ marginLeft: "10px" }} onClick={() => viewEmployee(employee.id!)} className="btn btn-info">View</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>No employees found.</td>
                                </tr>
                            )}
                       
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListEmployeeComponent;
