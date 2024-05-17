import React, { useContext, useState,memo } from 'react';
import Swal from 'sweetalert2';
import { AssignBeaconContext } from '../../Context/AssignBeaconProvider';

const AssignBeaconTable = memo(() => {
    const { assignments, loading, error, setAssignments } = useContext(AssignBeaconContext);
    const [editAssignmentId, setEditAssignmentId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        PersonaName: '',
        BeaconMac: '',
        Timestamp: ''
    });

    const handleEditClick = (assignment) => {
        // Verificar si el beacon ya está asignado a otra persona (que no sea la persona actual del contexto de edición)
        const isBeaconAssignedToOthers = assignments.some((assgn) => assgn.BeaconMac === assignment.BeaconMac && assgn.AsignacionID !== assignment.AsignacionID);
        if (isBeaconAssignedToOthers) {
            Swal.fire('Error', 'Este beacon ya está asignado a otra persona.', 'error');
            return; // Detener la acción de editar
        }
        setEditAssignmentId(assignment.AsignacionID);
        setEditFormData({
            PersonaName: assignment.PersonaName,
            BeaconMac: assignment.BeaconMac,
            Timestamp: assignment.Timestamp
        });
    };
    
    

    const handleSave = async () => {
        const response = await fetch(`http://localhost:3000/assignbeacon/${editAssignmentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editFormData)
        });
        if (response.ok) {
            Swal.fire('Updated!', 'Your assignment has been updated.', 'success');
            setEditAssignmentId(null);
            // Actualizar el estado local
            setAssignments(prev => prev.map(assignment => {
                if (assignment.AsignacionID === editAssignmentId) {
                    return { ...assignment, ...editFormData };
                }
                return assignment;
            }));
        } else {
            Swal.fire('Error', 'Failed to update assignment.', 'error');
        }
    };

    const handleCancel = () => {
        setEditAssignmentId(null);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/assignbeacon/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setAssignments(prev => prev.filter(assignment => assignment.AsignacionID !== id));
                Swal.fire('Deleted!', 'Your assignment has been deleted.', 'success');
            }
            else {
                throw new Error('Failed to delete assignment');
            }
        } catch (error) {
            console.error('Error deleting assignment:', error);
            Swal.fire('Error', 'Failed to delete assignment.', 'error');
        }
    };
    
    const formatLocalDateTime = (dateTime) => {
        const localDate = new Date(dateTime);
        return localDate.toLocaleString();
    };

    if (loading) return <p>Loading assignments...</p>;
    if (error) return <p>Error loading assignments: {error}</p>;

    return (
        <div>
            <h2 className='tituloTabla'>ASIGNACIONES</h2>
            <table className='tabla'>
                <thead>
                    <tr>
                        <th>Persona</th>
                        <th>Beacon</th>
                        <th>Fecha y Hora de Asignación</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.AsignacionID}>
                            {editAssignmentId === assignment.AsignacionID ? (
                                <>
                                    <td><input type="text" name="PersonaName" value={editFormData.PersonaName} onChange={handleFormChange} /></td>
                                    <td><input type="text" name="BeaconMac" value={editFormData.BeaconMac} onChange={handleFormChange} /></td>
                                    <td><input type="datetime-local" name="Timestamp" value={editFormData.Timestamp} onChange={handleFormChange} /></td>
                                    <td>
                                        
                                        <div className='containerButton'>
                                    <img onClick={handleSave} src='/img/save.png'/>
                                    <img onClick={handleCancel} src='/img/cancelled.png'/>
                                    </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{assignment.PersonaName}</td>
                                    <td>{assignment.BeaconMac}</td>
                                    <td>{formatLocalDateTime(assignment.Timestamp)}</td>
                                    <td>
                                       

                                        <div className='containerButton'>
                                   <img onClick={() => handleEditClick(assignment)}src='/img/edit.png'/>
                                    
                                   
                                    <img  onClick={() => handleDelete(assignment.AsignacionID)} src='/img/delete.png'/>
                                   </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
})

export default AssignBeaconTable;
