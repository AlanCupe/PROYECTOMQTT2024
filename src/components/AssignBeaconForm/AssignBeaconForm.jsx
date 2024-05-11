import React, { useState, useEffect } from 'react';

const AssignBeaconForm = () => {
    const [people, setPeople] = useState([]);
    const [beacons, setBeacons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState('');
    const [selectedBeacon, setSelectedBeacon] = useState('');
    const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 19).replace('T', ' '));

    useEffect(() => {
        const fetchPeopleAndBeacons = async () => {
            try {
                const peopleResponse = await fetch('http://localhost:3000/personas');
                const beaconsResponse = await fetch('http://localhost:3000/beacons');
                if (peopleResponse.ok && beaconsResponse.ok) {
                    const peopleData = await peopleResponse.json();
                    const beaconsData = await beaconsResponse.json();
                    setPeople(peopleData);
                    setBeacons(beaconsData);
                } else {
                    throw new Error('Failed to fetch');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchPeopleAndBeacons();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const postData = { PersonaID: selectedPerson, iBeaconID: selectedBeacon, Timestamp: timestamp };
        try {
            const response = await fetch('http://localhost:3000/assignbeacon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            const responseData = await response.json();
            console.log('Server Response:', responseData);
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Asignar Beacon a Personal</h2>
            <div>
                <label htmlFor="person">Seleccionar Persona:</label>
                <select
                    id="person"
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(e.target.value)}
                >
                    <option value="">Seleccione una persona</option>
                    {people.map((person) => (
                        <option key={person.PersonaID} value={person.PersonaID}>
                            {person.Nombre} {person.Apellido}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="beacon">Seleccionar Beacon:</label>
                <select
                    id="beacon"
                    value={selectedBeacon}
                    onChange={(e) => setSelectedBeacon(e.target.value)}
                >
                    <option value="">Seleccione un beacon</option>
                    {beacons.map((beacon) => (
                        <option key={beacon.iBeaconID} value={beacon.iBeaconID}>
                            {beacon.Descripcion}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="timestamp">Fecha y Hora de Asignación:</label>
                <input
                    type="datetime-local"
                    id="timestamp"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                />
            </div>
            <button type="submit">Asignar Beacon</button>
        </form>
    );
};

export default AssignBeaconForm;
