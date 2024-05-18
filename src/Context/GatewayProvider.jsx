import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const GatewayContext = createContext();

export const GatewayProvider = ({ children }) => {
    const [gateways, setGateways] = useState([]);
    const [areas, setAreas] = useState([]);
    const [asignaciones,setAsignaciones] = useState([]);

    useEffect(() => {
        fetchGateways();
        fetchAreas();
        fetchAsignaciones();
    }, []);

    const fetchGateways = async () => {
        const response = await axios.get('http://localhost:3000/gatewayregister');
        setGateways(response.data);
    };

    const fetchAreas = async () => {
        const response = await axios.get('http://localhost:3000/areas');
        setAreas(response.data);
    };

    const createGateway = async (gatewayData) => {
        await axios.post('http://localhost:3000/gatewayregister', gatewayData);
        fetchGateways();
    };

    const updateGateway = async (id, macAddress) => {
        await axios.put(`http://localhost:3000/gatewayregister/${id}`, { MacAddress: macAddress });
        fetchGateways();
    };

    const deleteGateway = async (id) => {
        await axios.delete(`http://localhost:3000/gatewayregister/${id}`);
        fetchGateways();
    };
    const fetchAsignaciones = async () => {
        const response = await axios.get('http://localhost:3000/asignaciongatewaysareas');
        setAsignaciones(response.data);
    };

    return (
        <GatewayContext.Provider value={{ gateways, createGateway, updateGateway, deleteGateway,areas ,fetchAsignaciones, asignaciones,setAsignaciones}}>
            {children}
        </GatewayContext.Provider>
    );
};
