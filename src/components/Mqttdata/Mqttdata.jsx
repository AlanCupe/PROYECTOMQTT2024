import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';


export const Mqttdata = () => {

  const [messageGateway1, setMessageGateway1] = useState('');
    const [messageGateway2, setMessageGateway2] = useState('');
    const [mqttClient, setMqttClient] = useState(null);

    useEffect(() => {
        const client = mqtt.connect('mqtt://localhost:9001');
        setMqttClient(client);
        
        client.on('message', (topic, message) => {
            const parsedMessage = JSON.parse(message.toString());
            if (topic === '/gw/ac233fc18d06/status') {
                setMessageGateway1(parsedMessage);
                saveDataToServer(topic, parsedMessage);
            } else if (topic === '/gw/ac233fc18cfb/status') {
                setMessageGateway2(parsedMessage);
                saveDataToServer(topic, parsedMessage);
            }else{

            }
        });

        return () => {
            if (client) {
                console.log('Desconectando cliente MQTT...');
                client.end();
            }
        };
    }, []);

    useEffect(() => {
        if (!mqttClient) return;

        console.log('Suscrito a los temas de los gateways:', messageGateway1, messageGateway2);
        mqttClient.subscribe('/gw/ac233fc18d06/status', (err) => {
            if (err) {
                console.error('Error al suscribirse al tema en Gateway 1:', err);
            } else {
                console.log('Suscrito al tema "/gw/ac233fc18d06/status" - Gateway 1');
            }
        });

        mqttClient.subscribe('/gw/ac233fc18cfb/status', (err) => {
            if (err) {
                console.error('Error al suscribirse al tema en Gateway 2:', err);
            } else {
                console.log('Suscrito al tema "/gw/ac233fc18cfb/status" - Gateway 2');
            }
        });
    }, [messageGateway1, messageGateway2, mqttClient]);

    const saveDataToServer = async (topic, data) => {
        console.log('Datos que se enviarán al servidor:', { topic, message: data });
        console.log('topico', topic);
        console.log('data',data);
        try {
            const response = await fetch('http://localhost:3000/mqtt/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic,
                    message: JSON.stringify(data) // Enviar directamente parsedMessage
                })
            });
    
            if (!response.ok) {
                const errorMessage = `Error al enviar datos al servidor: ${response.status} - ${response.statusText}`;
                throw new Error(errorMessage);
            }
    
            const responseData = await response.json();
            console.log('Respuesta del servidor:', responseData);
        } catch (error) {
            console.error('Detalles del error:', error.message);
            // Muestra un mensaje de error al usuario
        }
    };
    
    
  return (
    <div>
      <h1>Datos MQTT - Gateway 1:</h1>
      <p>Mensaje 1: {JSON.stringify(messageGateway1)}</p>
      <h1>Datos MQTT - Gateway 2:</h1>
      <p>Mensaje 2: {JSON.stringify(messageGateway2)}</p>
      <h1>Datos MQTT - Gateway 3:</h1>
    </div>
  )
}
