import React, { memo, useContext, useState, useEffect } from 'react';
import { BeaconContext } from '../../Context/BeaconProvider';
import "./BeaconsForm.css";
import Swal from 'sweetalert2';

export const BeaconsForm = memo(() => {
    const [formData, setFormData] = useState({
        MacAddress: '',
        BleNo: '',
        BleName: '',
        iBeaconUuid: '',
        iBeaconMajor: '',
        iBeaconMinor: '',
        Rssi: '',
        iBeaconTxPower: '',
        Battery: ''
    });
    const [error, setError] = useState('');

    const { addBeacons, beacons } = useContext(BeaconContext); // Mueve useContext al nivel superior

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (formData.MacAddress.replace(/[:-]/g, "").length !== 12) {
            setError('El MAC Address debe tener exactamente 12 caracteres hexadecimales.');
            Swal.fire('Error', 'El MAC Address debe tener exactamente 12 caracteres hexadecimales.', 'error');
            return;
        }
    
        const macExists = beacons.some(beacon => beacon.MacAddress === formData.MacAddress);
        if (macExists) {
            Swal.fire('Error', 'La dirección MAC ya está registrada.', 'error');
            return;
        }
    
        fetch('http://localhost:3000/beacons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        }).then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Network response was not ok');
                });
            }
            return response.json();
        }).then(data => {
            addBeacons(data);
            setFormData({
                MacAddress: '',
                // reset otros campos
            });
            Swal.fire('¡Éxito!', 'Beacon creado correctamente', 'success');
            setError('');
        }).catch((error) => {
            console.error('Error:', error);
            Swal.fire('Error', error.message, 'error');
        });
    };

    useEffect(() => {
        if (error) {
            Swal.fire('Error', error, 'error');
        }
    }, [error]);

    return (
        <form onSubmit={handleSubmit}  className='form-beacon'>
            <h2 className='titleRegister'>REGISTRAR NUEVO BEACON</h2>
           <div className="form-input">
           <input type="text" name="MacAddress" value={formData.MacAddress} onChange={handleChange} required placeholder='MAC Address' />
            <button type="submit">Crear Beacon</button>
           </div>
        </form>
    );
});

export default BeaconsForm;
