import React, { useContext, useEffect } from 'react';
import { EventosBeaconsContext } from '../../Context/EventosBeaconsProvider';
import { GatewayContext } from '../../Context/GatewayProvider';
import ProjectTable from '../../components/ProjectTable/ProjectTable';
import './Dashboard.css';

export const Dashboard = () => {
    const { eventosBeacons, loading } = useContext(EventosBeaconsContext);
    const { gateways, asignaciones } = useContext(GatewayContext);

    useEffect(() => {
        console.log("eventos Beacons", eventosBeacons);
        console.log("GATEWAYS__________DASHBOARD", gateways);
        console.log("ASIGNACIONES________", asignaciones);
    }, [eventosBeacons, gateways, asignaciones]);

    if (loading) {
        return <div className='grid'>Cargando...</div>;
    }

    const getUniqueBeaconsByGateway = (gatewayID) => {
              const beacons = eventosBeacons.filter(evento => evento.GatewayID === gatewayID);

        const latestEvents = beacons.reduce((acc, current) => {

            const existing = acc[current.iBeaconID];

            if (!existing || new Date(existing.Timestamp) < new Date(current.Timestamp)) {

                acc[current.iBeaconID] = current;

            }

            return acc;

        }, {});

        return Object.values(latestEvents);

    };




    const getAreaNombre = (macAddress) => {
        const asignacion = asignaciones.find(aga => aga.macGateway === macAddress);
        console.log("Asignacion en la funcion_________", asignacion);
        return asignacion ? asignacion.areaTrabajo : 'No asignada';
    };

    return (
        <div className='grid'>
            {gateways.map(gateway => {
                const totalEvents = getUniqueBeaconsByGateway(gateway.GatewayID);
                const areaNombre = getAreaNombre(gateway.MacAddress);
                console.log("Area Nombre:", areaNombre);
                return (
                    <div key={gateway.GatewayID}>
                       <div className='containerInfoTable'>
                       <div className='containerImgTable'>
                        <img src='/img/viewIcon.svg'/>
                       </div>
                       <h2>{gateway.MacAddress}</h2>
                        <h3>Área: {areaNombre}</h3>
                        <p>Total de beacons únicos detectados: {totalEvents.length}</p>
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
