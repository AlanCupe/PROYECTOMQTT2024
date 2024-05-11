import React from 'react';
import './ProjectTable.css';

const employes = [
    { id: 1, name: 'Argon Design System', lastname: '$2,500 USD', company: 'pending', dataHour: 60 },
    { id: 2, name: 'Angular Now UI Kit PRO', lastname: '$1,800 USD', company: 'completed', dataHour: 100 },
    { id: 3, name: 'Black Dashboard Sketch', lastname: '$3,150 USD', company: 'delayed', dataHour: 73 }, 
    { id: 4, name: 'React Material Dashboard', lastname: '$4,400 USD', company: 'on schedule', dataHour: 90 }, 
    { id: 5, name: 'React Material Dashboard', lastname: '$2,200 USD', company: 'completed', dataHour: 100 }
]

const employeTable = () => {
    return (
        <div className="employe-table">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Lastname</th>
                        <th>Company</th>
                        <th>Date - Hour</th>

                    </tr>
                </thead>
                <tbody>
                    {employes.map(employe => (
                        <tr key={employe.id}>
                            <td>{employe.name}</td>
                            <td>{employe.lastname}</td>
                            <td>{employe.company}</td>
                            <td>{employe.dataHour}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default employeTable;
