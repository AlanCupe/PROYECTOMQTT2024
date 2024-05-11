
import React, { useState, useContext } from 'react';
import { UserContext } from '../../Context/UserProvider';

const EmployeeForm = () => {
    const [formData, setFormData] = useState({
        Nombre: '',
        Apellido: '',
        Dni: '',
        Cargo: '',
        Empresa: ''
    });
    const { addUser } = useContext(UserContext); 

    console.log(addUser);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/personas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            addUser(data);  
            alert('Empleado creado correctamente');
            setFormData({
                Nombre: '',
                Apellido: '',
                Dni: '',
                Cargo: '',
                Empresa: ''
            });
            console.log(data);

        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Employees</h2>
            <div>
                <label htmlFor="Nombre">Nombre:</label>
                <input
                    type="text"
                    id="Nombre"
                    name="Nombre"
                    value={formData.Nombre}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="Apellido">Apellido:</label>
                <input
                    type="text"
                    id="Apellido"
                    name="Apellido"
                    value={formData.Apellido}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="Dni">Documento de Identidad:</label>
                <input
                    type="text"
                    id="Dni"
                    name="Dni"
                    value={formData.Dni}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="Cargo">Puesto:</label>
                <input
                    type="text"
                    id="Cargo"
                    name="Cargo"
                    value={formData.Cargo}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="Empresa">Empresa:</label>
                <input
                    type="text"
                    id="Empresa"
                    name="Empresa"
                    value={formData.Empresa}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Create</button>
        </form>
    );
};

export default EmployeeForm;
