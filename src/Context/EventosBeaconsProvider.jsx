import React, { createContext, useState, useEffect } from 'react';

export const EventosBeaconsContext = createContext();

export const EventosBeaconsProvider = ({ children }) => {
    const [eventosBeacons, setEventosBeacons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventosBeacons = async () => {
            try {
                const response = await fetch('http://localhost:3000/eventosbeacons/eventos');
                const data = await response.json();
                setEventosBeacons(data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los eventos:', error);
                setLoading(false);
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
