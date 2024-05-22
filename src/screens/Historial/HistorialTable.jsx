import React, { useContext } from 'react';
import { HistorialContext } from '../../Context/HistorialProvider';
import './HistorialTable.css';
import { saveAs } from 'file-saver';

const HistorialTable = () => {
    const { historial, loading, error } = useContext(HistorialContext);

    const downloadExcel = async () => {
        try {
            const response = await fetch('http://localhost:3000/historial/excel');
            const blob = await response.blob();
            saveAs(blob, 'historial_asignaciones.xlsx');
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    };

    if (loading) return <p>Loading historial...</p>;
    if (error) return <p>Error loading historial: {error}</p>;

    return (
        <div>
            <h2>Historial de Asignaciones</h2>
            <button onClick={downloadExcel}>Descargar Excel</button>
            <table>
                <thead>
                    <tr>
                        <th>Persona</th>
                        <th>Beacon</th>
                        <th>Fecha de Asignación</th>
                        <th>Fecha de Baja</th>
                    </tr>
                </thead>
                <tbody>
                    {historial.map((entry) => (
                        <tr key={entry.HistorialID}>
                            <td>{entry.PersonaName}</td>
                            <td>{entry.BeaconMac}</td>
                            <td>{new Date(entry.fechaAsignacion).toLocaleString()}</td>
                            <td>{entry.fechaBaja ? new Date(entry.fechaBaja).toISOString() : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorialTable;
