import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const GatewayContext = createContext();

export const GatewayProvider = ({ children }) => {
    const [gateways, setGateways] = useState([]);

    useEffect(() => {
        fetchGateways();
    }, []);

    const fetchGateways = async () => {
        const response = await axios.get('http://localhost:3000/gatewayregister');
        setGateways(response.data);
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

    return (
        <GatewayContext.Provider value={{ gateways, createGateway, updateGateway, deleteGateway }}>
            {children}
        </GatewayContext.Provider>
    );
};
