import React, { useEffect } from 'react';
import './ProjectTable.css';

const ProjectTable = ({ data }) => {
    useEffect(() => {
        console.log("Datos desde DASHBOARD A PROJECT TABLE:", data);
    }, [data]);

    const filteredData = data.filter(evento => evento.MacAddress.startsWith('C30000'));

    if (!filteredData || filteredData.length === 0) {
        return <div>No hay datos para mostrar.</div>;
    }

    return (
        <table className='project-table'>
            <thead>
                <tr>
                    <th>Beacon</th>
                    <th>Tipo de Evento</th>
                    <th>RSSI</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map(evento => (
                    <tr key={evento.EventoID}>
                        <td>{evento.BeaconDisplayName}</td>
                        <td>{evento.TipoEvento}</td>
                        <td>{evento.RSSI}</td>
                        <td>{new Date(evento.Timestamp).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProjectTable;
