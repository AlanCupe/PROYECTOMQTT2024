import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [shouldUpdate, setShouldUpdate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/personas');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
    
        fetchData();  // Carga inicial
    }, [shouldUpdate]);  // Carga posterior a cambios

    const addUser = (user) => {
        setUsers([...users, user]);
        setShouldUpdate(true);  // Establece el trigger para recargar datos
    };

    const deleteUser = (id) => {
        setUsers(users.filter(user => user.PersonaID !== id));
        setShouldUpdate(true);
    };

    const updateUser = (id, updatedUser) => {
        const updatedUsers = users.map(user => user.PersonaID === id ? updatedUser : user);
        setUsers(updatedUsers);
        setShouldUpdate(true);
    };

    return (
        <UserContext.Provider value={{ users, addUser, deleteUser, updateUser, setShouldUpdate }}>
            {children}
        </UserContext.Provider>
    );
};
