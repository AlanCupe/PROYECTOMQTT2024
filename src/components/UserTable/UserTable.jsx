import React, { useState, useContext, useMemo, memo, useEffect } from 'react';
import { UserContext } from '../../Context/UserProvider';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import './UserTable.css';

Modal.setAppElement('#root'); // Asegúrate de que el id coincida con el id del elemento root en tu index.html

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
    const [reportData, setReportData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        Nombre: '',
        Apellido: '',
        Dni: '',
        Cargo: '',
        Empresa: '',
    });

    const memoizedUsers = useMemo(() => {
        return users.map(user => ({
            ...user,
            fullName: `${user.Nombre} ${user.Apellido}`
        }));
    }, [users]);

    useEffect(() => {
        setFilteredData(reportData);
    }, [reportData]);

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setError('');

        if ((name === 'Nombre' || name === 'Apellido') && value && !/^[a-zA-Z\s]*$/.test(value)) {
            setError(`El campo ${name} solo debe contener letras y espacios.`);
            return;
        } else if (name === 'Dni' && value && (!/^\d+$/.test(value) || value.length > 8)) {
            setError('El DNI solo debe contener hasta 8 dígitos numéricos.');
            return;
        }

        setEditFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!editFormData.Nombre || !editFormData.Apellido || !editFormData.Dni || !editFormData.Cargo || !editFormData.Empresa) {
            setError('Todos los campos son obligatorios.');
            return false;
        }
        if (editFormData.Dni.length !== 8 || !/^\d+$/.test(editFormData.Dni)) {
            setError('El DNI debe tener 8 caracteres numéricos.');
            return false;
        }
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
        try {
            const response = await fetch(`http://localhost:3000/personas/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error deleting user');
            }
            fetchUsers();
        } catch (error) {
            setError('Error deleting user');
            console.error('Error:', error);
        }
    };

    const handleSaveClick = async (id) => {
        if (!validateForm()) return;

        try {
            const response = await fetch(`http://localhost:3000/personas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });
            if (!response.ok) {
                throw new Error('Error saving changes');
            }
            fetchUsers();
            setEditingId(null);
        } catch (error) {
            setError('Error saving changes');
            console.error('Error:', error);
        }
    };

    const fetchReportData = async () => {
        try {
            const response = await fetch('http://localhost:3000/report/reportData');
            if (!response.ok) {
                throw new Error('Error fetching report data');
            }
            const data = await response.json();
            setReportData(data);
            setModalIsOpen(true); // Abre el modal cuando se obtienen los datos
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const applyFilters = () => {
        const filtered = reportData.filter(persona => {
            return Object.keys(filters).every(key => 
                persona[key].toLowerCase().includes(filters[key].toLowerCase())
            );
        });
        setFilteredData(filtered);
    };

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Report");
        XLSX.writeFile(workbook, "filtered_report.xlsx");
    };

    return (
        <>
            <div style={{ color: 'red' }}>{error}</div>
            <div className="filters">
                <button onClick={fetchReportData}>Ver Reporte</button>
            </div>
            <table className="tabla">
                <caption className="tituloTabla">PERSONAL REGISTRADO</caption>
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
                                            <img onClick={() => handleSaveClick(user.PersonaID)} src='/img/save.png' alt="Guardar" />
                                            <img onClick={handleCancelClick} src='/img/cancelled.png' alt="Cancelar" />
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
                                            <img onClick={() => handleEditClick(user)} src='/img/edit.png' alt="Editar" />
                                            <img onClick={() => handleDelete(user.PersonaID)} src='/img/delete.png' alt="Eliminar" />
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Vista previa del reporte"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Vista previa del reporte</h2>
                <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
                <div className="filters">
                    <label>
                        Nombre:
                        <input type="text" name="Nombre" value={filters.Nombre} onChange={handleFilterChange} />
                    </label>
                    <label>
                        Apellido:
                        <input type="text" name="Apellido" value={filters.Apellido} onChange={handleFilterChange} />
                    </label>
                    <label>
                        Documento:
                        <input type="text" name="Dni" value={filters.Dni} onChange={handleFilterChange} />
                    </label>
                    <label>
                        Puesto:
                        <input type="text" name="Cargo" value={filters.Cargo} onChange={handleFilterChange} />
                    </label>
                    <label>
                        Empresa:
                        <input type="text" name="Empresa" value={filters.Empresa} onChange={handleFilterChange} />
                    </label>
                    <button onClick={applyFilters}>Aplicar Filtros</button>
                </div>
                <button onClick={handleDownload}>Descargar en Excel</button>
                <div className="modal-content">
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>DNI</th>
                                <th>Cargo</th>
                                <th>Empresa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(persona => (
                                <tr key={persona.PersonaID}>
                                    <td>{persona.PersonaID}</td>
                                    <td>{persona.Nombre}</td>
                                    <td>{persona.Apellido}</td>
                                    <td>{persona.Dni}</td>
                                    <td>{persona.Cargo}</td>
                                    <td>{persona.Empresa}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </>
    );
});

export default UsersTable;
