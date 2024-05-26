import React, { createContext, useState } from 'react';

export const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
    const [subscribedTopics, setSubscribedTopics] = useState(new Set());

    return (
        <MqttContext.Provider value={{ subscribedTopics, setSubscribedTopics }}>
            {children}
        </MqttContext.Provider>
    );
};
