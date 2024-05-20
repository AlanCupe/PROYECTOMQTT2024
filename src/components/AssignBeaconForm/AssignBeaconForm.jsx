import React, { useState, useEffect, useContext, memo } from 'react';
import Swal from 'sweetalert2';
import './AssignBeaconsForm.css';
import { AssignBeaconContext } from '../../Context/AssignBeaconProvider';
import Select from 'react-select';

const AssignBeaconForm = memo(() => {
    const { assignments, setAssignments } = useContext(AssignBeaconContext);
    const [people, setPeople] = useState([]);
    const [beacons, setBeacons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [selectedBeacon, setSelectedBeacon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPeopleAndBeacons = async () => {
            setLoading(true);
            setError('');
            try {
                const [peopleResponse, beaconsResponse] = await Promise.all([
                    fetch('http://localhost:3000/personas'),
                    fetch('http://localhost:3000/beacons')
                ]);

                if (peopleResponse.ok && beaconsResponse.ok) {
                    const peopleData = await peopleResponse.json();
                    const beaconsData = await beaconsResponse.json();

                    const assignedPersonIds = new Set(assignments.map(a => a.PersonaID));
                    const assignedBeaconIds = new Set(assignments.map(a => a.iBeaconID));

                    const unassignedPeople = peopleData.filter(person => !assignedPersonIds.has(person.PersonaID));
                    const unassignedBeacons = beaconsData.filter(beacon => !assignedBeaconIds.has(beacon.iBeaconID));

                    setPeople(unassignedPeople);
                    setBeacons(unassignedBeacons);
                } else {
                    throw new Error('Failed to fetch');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data from server.');
            }
            setLoading(false);
        };

        fetchPeopleAndBeacons();
    }, [assignments]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedPerson || !selectedBeacon) {
            Swal.fire('Error', 'Persona o Beacon no seleccionado.', 'error');
            return;
        }

        const persona = people.find(p => p.PersonaID === selectedPerson.value);
        const beacon = beacons.find(b => b.iBeaconID === selectedBeacon.value);

        const postData = {
            PersonaID: persona.PersonaID,
            iBeaconID: beacon.iBeaconID,
            Timestamp: new Date().toISOString()
        };

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/assignbeacon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                const newAssignment = await response.json();
                setAssignments(prevAssignments => [...prevAssignments, {
                    ...newAssignment,
                    PersonaName: `${persona.Nombre} ${persona.Apellido}`,
                    BeaconMac: beacon.MacAddress,
                    Timestamp: postData.Timestamp
                }]);
                Swal.fire('Éxito', 'Beacon asignado correctamente', 'success');
                setSelectedPerson(null);
                setSelectedBeacon(null);
            } else {
                throw new Error('Failed to post data');
            }
        } catch (error) {
            console.error('Error posting data:', error);
            Swal.fire('Error', 'No se pudo asignar el beacon.', 'error');
        }
        setLoading(false);
    };

    const personOptions = people.map(person => ({
        value: person.PersonaID,
        label: `${person.Nombre} ${person.Apellido}`
    }));

    const beaconOptions = beacons.map(beacon => ({
        value: beacon.iBeaconID,
        label: beacon.MacAddress
    }));

    return (
        <form onSubmit={handleSubmit} className='form-AsignacionBeacons'>
            <h2>ASIGNAR BEACON A PERSONAL</h2>
            {error && <p className="error">{error}</p>}
            {loading ? <p>Loading...</p> : (
                <>
                    <div className="form-group">
                        <Select
                            className='select'
                            id="personSelect"
                            options={personOptions}
                            value={selectedPerson}
                            onChange={setSelectedPerson}
                            placeholder="Seleccione una persona"
                            isClearable
                        />
                    </div>
                    <div className="form-group">
                        <Select
                            className='select'
                            id="beaconSelect"
                            options={beaconOptions}
                            value={selectedBeacon}
                            onChange={setSelectedBeacon}
                            placeholder="Seleccione un beacon"
                            isClearable
                        />
                    </div>
                    <button type="submit">Asignar Beacon</button>
                </>
            )}
        </form>
    );
});

export default AssignBeaconForm;
