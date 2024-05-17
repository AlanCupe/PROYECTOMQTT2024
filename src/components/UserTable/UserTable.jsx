import React, { useState, useContext, useMemo , memo} from 'react';
import { UserContext } from '../../Context/UserProvider';
import './UserTable.css';

const UsersTable = memo(() => {
    const { users, fetchUsers } = useContext(UserContext);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        Nombre: '',
        Apellido: '',
        Dni: '',
        Cargo: '',
        Empresa: '',
    });
    const [error, setError] = useState('');

    const memoizedUsers = useMemo(() => {
        return users.map(user => ({
            ...user,
            fullName: `${user.Nombre} ${user.Apellido}`
        }));
    }, [users]);

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        // Limpia errores previos cada vez que se cambia el valor
        setError('');

        if ((name === 'Nombre' || name === 'Apellido') && value && !/^[a-zA-Z\s]*$/.test(value)) {
            setError(`El campo ${name} solo debe contener letras y espacios.`);
            return;  // No actualiza el estado si el valor no es válido
        } else if (name === 'Dni' && value && (!/^\d+$/.test(value) || value.length > 8)) {
            setError('El DNI solo debe contener hasta 8 dígitos numéricos.');
            return;  // No actualiza el estado si el valor no es válido
        }

        setEditFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const validateForm = () => {
        // Verifica que no haya campos vacíos
        if (!editFormData.Nombre || !editFormData.Apellido || !editFormData.Dni || !editFormData.Cargo || !editFormData.Empresa) {
            setError('Todos los campos son obligatorios.');
            return false;
        }
        // Verifica que el DNI tenga 8 caracteres y solo números
        if (editFormData.Dni.length !== 8 || !/^\d+$/.test(editFormData.Dni)) {
            setError('El DNI debe tener 8 caracteres numéricos.');
            return false;
        }
        // Verifica que el DNI no esté duplicado (solo en creación o cambio de DNI)
        if (editingId === null || editFormData.Dni !== users.find(user => user.PersonaID === editingId)?.Dni) {
            if (users.some(user => user.Dni === editFormData.Dni)) {
                setError('El DNI ya está registrado.');
                return false;
            }
        }
        return true;
    };
    const handleEditClick = (user) => {
        setEditingId(user.PersonaID);
        setEditFormData(user);
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setError('');
    };

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:3000/personas/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Actualizar la lista de usuarios en el contexto después de eliminar
            fetchUsers();
        }
    };

    const handleSaveClick = async (id) => {
        if (!validateForm()) return; // Detiene la función si la validación falla

        const response = await fetch(`http://localhost:3000/personas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editFormData),
        });

        if (response.ok) {
            fetchUsers();
            setEditingId(null);
           
        } else {
            setError('Error al guardar los cambios.');
        }
    };

    return (
        <>
        <div style={{ color: 'red' }}>{error}</div>
        <table className='tabla'>
            <caption className='tituloTabla'>PERSONAL REGISTRADO</caption>
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
                {memoizedUsers.map(user => (
                    <tr key={user.PersonaID}>
                        {editingId === user.PersonaID ? (
                            <>
                                <td><input type="text" required value={editFormData.Nombre} name="Nombre" onChange={handleEditFormChange} /></td>
                                <td><input type="text" required value={editFormData.Apellido} name="Apellido" onChange={handleEditFormChange} /></td>
                                <td><input type="text" required value={editFormData.Dni} name="Dni" onChange={handleEditFormChange} /></td>
                                <td><input type="text" required value={editFormData.Cargo} name="Cargo" onChange={handleEditFormChange} /></td>
                                <td><input type="text" required value={editFormData.Empresa} name="Empresa" onChange={handleEditFormChange} /></td>
                                <td>
                                    <div className='containerButton'>
                                    <img onClick={() => handleSaveClick(user.PersonaID)} src='/img/save.png'/>
                                    <img onClick={handleCancelClick} src='/img/cancelled.png'/>


                                    </div>

                                    
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{user.Nombre}</td>
                                <td>{user.Apellido}</td>
                                <td>{user.Dni}</td>
                                <td>{user.Cargo}</td>
                                <td>{user.Empresa}</td>
                                <td>
                                   <div className='containerButton'>
                                   <img onClick={() => handleEditClick(user)} src='/img/edit.png'/>
                                    
                                   
                                    <img  onClick={() => handleDelete(user.PersonaID)} src='/img/delete.png'/>
                                   </div>
                                    
                                </td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </>
    );
});

export default UsersTable;
