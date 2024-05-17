import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [updateTrigger, setUpdateTrigger] = useState(false);  // Estado para disparar la actualización

    // Efecto para cargar usuarios inicialmente y recargar cuando updateTrigger cambia
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3000/personas');
            const data = await response.json();
            setUsers(data);
        };
        fetchData();
    }, [updateTrigger]);  // Dependencia en updateTrigger

    const addUser = (user) => {
        setUsers(prevUsers => [...prevUsers, user]);
        setUpdateTrigger(prev => !prev);  // Cambiar el estado para disparar la recarga
    };
    // En UserProvider.js o el componente que maneja el contexto


    const fetchUsers = async () => {
        const response = await fetch('http://localhost:3000/personas');
        const data = await response.json();
        setUsers(data);
    }
// Asegúrate de proporcionar `fetchUsers` junto con `users` en el valor del contexto.


    return (
        <UserContext.Provider value={{ users, addUser ,fetchUsers}}>
            {children}
        </UserContext.Provider>
    );
};
