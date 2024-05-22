import React, { useContext, useEffect } from 'react';
import { EventosBeaconsContext } from '../../Context/EventosBeaconsProvider';
import { GatewayContext } from '../../Context/GatewayProvider';
import ProjectTable from '../../components/ProjectTable/ProjectTable';
import './Dashboard.css';

export const Dashboard = () => {
    const { eventosBeacons, loading } = useContext(EventosBeaconsContext);
    const { gateways, asignaciones } = useContext(GatewayContext);

    useEffect(() => {
        console.log("Eventos Beacons:", eventosBeacons);
        console.log("Gateways:", gateways);
        console.log("Asignaciones:", asignaciones);
    }, [eventosBeacons, gateways, asignaciones]);

    if (loading) {
        return <div className='grid'>Cargando...</div>;
    }

    const getUniqueBeaconsByGateway = (gatewayID) => {
        const beacons = eventosBeacons.filter(evento => evento.GatewayID === gatewayID);
        const latestEvents = beacons.reduce((acc, current) => {
            const existing = acc[current.MacAddress];
            if (!existing || new Date(existing.Timestamp) < new Date(current.Timestamp)) {
                acc[current.MacAddress] = current;
            }
            return acc;
        }, {});
        return Object.values(latestEvents);
    };

    const getAreaNombre = (macAddress) => {
        const asignacion = asignaciones.find(aga => aga.macGateway === macAddress);
        return asignacion ? asignacion.areaTrabajo : 'No asignada';
    };

    return (
        <div className='grid'>
            {gateways.map(gateway => {
                const totalEvents = getUniqueBeaconsByGateway(gateway.GatewayID);
                const areaNombre = getAreaNombre(gateway.MacAddress);
                return (
                    <div key={gateway.GatewayID}>
                        <div className='containerInfoTable'>
                            <div className='containerImgTable'>
                               
                            </div>
                            <h2 className='flexRow containerData'><img className='imgRouter' src="/img/gateway.png" alt="gateway" /><span>{gateway.MacAddress}</span> </h2>
                            <h3> {areaNombre}</h3>
                            <p className='flexRow imgP'><img src="/img/user.png" alt="usuarioDetectados" /> <span> {totalEvents.length}</span></p>
                        </div>
                        <div className='table-container'>
                            {totalEvents.length > 0 ? (
                                <ProjectTable data={totalEvents} />
                            ) : (
                                <div>No hay datos disponibles.</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
