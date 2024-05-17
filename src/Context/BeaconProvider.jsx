import React, { createContext, useState, useEffect } from 'react';

export const BeaconContext = createContext();

export const BeaconProvider = ({ children }) => {
    const [beacons, setBeacons] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(false);
   

    useEffect(() => {
        const fetchBeacons = async () => {
            try {
                const response = await fetch('http://localhost:3000/beacons');
                const data = await response.json();
                setBeacons(data);
            } catch (error) {
                console.error('Error fetching beacons:', error);
            }
        };
        fetchBeacons();
    }, [updateTrigger]);



   
    const addBeacons = (beacon) => {
        setBeacons(prevBeacons => [...prevBeacons, beacon]);
        setUpdateTrigger(prev => !prev);  // Cambiar el estado para disparar la recarga
    };

    const fetchBeacons = async () => {
        const response = await fetch('http://localhost:3000/beacons');
        const data = await response.json();
        setBeacons(data);
    }
    return (
        <BeaconContext.Provider value={{ beacons, addBeacons, fetchBeacons}}>
            {children}
        </BeaconContext.Provider>
    );
};
