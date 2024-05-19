import React, { useEffect } from 'react';
import './ProjectTable.css';

const ProjectTable = ({ data }) => {
    useEffect(() => {
        console.log("Datos desde DASHBOARD A PROJECT TABLE:", data);
    }, [data]);

    if (!data || data.length === 0) {
        return <div>No hay datos para mostrar.</div>;
    }

    return (
        <table className='project-table'>
            <thead>
                <tr>
                    <th>Beacon</th>
                    <th>Tipo de Evento</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {data.map(evento => (
                    <tr key={evento.EventoID}>
                        <td>{evento.BeaconDisplayName}</td>
                        <td>{evento.TipoEvento}</td>
                        <td>{new Date(evento.Timestamp).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProjectTable;
