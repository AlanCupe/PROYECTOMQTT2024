import React, { useContext } from 'react';
import { EventosBeaconsContext } from '../../Context/EventosBeaconsProvider';
import ProjectTable from '../../components/ProjectTable/ProjectTable';
import './Dashboard.css';

export const Dashboard = () => {
    const { eventosBeacons, loading } = useContext(EventosBeaconsContext);

    if (loading) {
        return <div className='grid'>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <div className='grid'>
            {eventosBeacons.length > 0 ? (
                <ProjectTable data={eventosBeacons} />
            ) : (
                <div>No hay datos disponibles.</div>
            )}
        </div>
    );
};
