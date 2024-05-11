import React, { useState, useEffect } from 'react';

import { UserContext } from '../../Context/UserProvider';

const UsersTable = () => {
    const [users, setUsers] = useState([ ]);
    

    // Cargar datos desde el backend al cargar el componente
    useEffect(() => {
        fetch('http://localhost:3000/personas')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    // Función para eliminar un usuario
    const handleDelete = (id) => {
        fetch(`http://localhost:3000/personas/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setUsers(users.filter(user => user.id !== id));
                }
            })
            .catch(error => console.error('Error deleting user:', error));
    };

    // Función para manejar la edición (esto puede ser una navegación a un formulario de edición o abrir un modal)
    const handleEdit = (user) => {
        console.log('Edit user:', user);
        // Aquí agregar lógica para editar un usuario
    };

    return (
        <table>
            <caption>Data User</caption>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Documento</th>
                    <th>Puesto</th>
                    <th>Empresa</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                        <tr key={user.PersonaID}> 
                            <td>{user.Nombre}</td>
                            <td>{user.Apellido}</td>
                            <td>{user.Dni}</td>
                            <td>{user.Cargo}</td>
                            <td>{user.Empresa}</td>
                            <td>
                                <button onClick={() => handleEdit(user)}>Editar</button>
                                <button onClick={() => handleDelete(user.PersonaID)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
};

export default UsersTable;
