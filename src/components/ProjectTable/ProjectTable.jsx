import React from 'react';
import './ProjectTable.css';

const ProjectTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No hay datos para mostrar.</div>;
    }

    return (
        <table className='project-table'>
            <thead>
                <tr>
                    {/* <th>EventoID</th> */}
                    <th>iBeaconID</th>
                    {/* <th>GatewayID</th> */}
                    <th>TipoEvento</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {data.map(evento => (
                    <tr key={evento.EventoID}>
                        {/* <td>{evento.EventoID}</td> */}
                        <td>{evento.iBeaconID}</td>
                        {/* <td>{evento.GatewayID}</td> */}
                        <td>{evento.TipoEvento}</td>
                        <td>{new Date(evento.Timestamp).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProjectTable;
