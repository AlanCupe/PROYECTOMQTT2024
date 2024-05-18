import React, { createContext, useState, useEffect } from 'react';

export const EventosBeaconsContext = createContext();

export const EventosBeaconsProvider = ({ children }) => {
    const [eventosBeacons, setEventosBeacons] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const fetchEventosBeacons = async () => {
            try {
                const response = await fetch('http://localhost:3000/eventosbeacons/eventos');
                const data = await response.json();
                setEventosBeacons(data);
                setLoading(false); // Datos cargados
            } catch (error) {
                console.error('Error al obtener los eventos:', error);
                setLoading(false); // Error al cargar datos
            }
        };

        fetchEventosBeacons();
    }, []);

    return (
        <EventosBeaconsContext.Provider value={{ eventosBeacons, loading }}>
            {children}
        </EventosBeaconsContext.Provider>
    );
};
