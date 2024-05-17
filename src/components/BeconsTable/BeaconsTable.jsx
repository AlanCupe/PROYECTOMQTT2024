import React, { useState, useEffect, useContext,memo } from 'react';
import { BeaconContext } from '../../Context/BeaconProvider';
import "./BeaconsTable.css"

export const BeaconsTable = memo(() => {
    const {beacons, fetchBeacons} = useContext(BeaconContext);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
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

    

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleEditClick = (beacon) => {
        setEditingId(beacon.iBeaconID);
        setEditFormData(beacon);
    };

    const handleCancelClick = () => {
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:3000/beacons/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchBeacons();
        }
    };

    const handleSaveClick = async (id) => {
        const response = await fetch(`http://localhost:3000/beacons/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editFormData),
        });

        if (response.ok) {
            fetchBeacons();
            setEditingId(null);
        } else {
            setError('Error al guardar los cambios.');
        }
    };

    return (
        <div>
        <div>
        <h2 className='tituloTabla'>BEACONS REGISTRADOS</h2>
        </div>
           
            <table className='tabla'>
                <thead>
                    <tr>
                        <th>MAC Address</th>
                        <th>Acciones</th>
                        {/* <th>BLE No</th>
                        <th>BLE Name</th>
                        <th>UUID</th>
                        <th>Major</th>
                        <th>Minor</th>
                        <th>RSSI</th>
                        <th>Tx Power</th>
                        <th>Battery</th>
                        <th>Acciones</th> */}
                    </tr>
                </thead>
                <tbody>
                    {beacons.map(beacon => (
                        <tr key={beacon.iBeaconID}>
                            {editingId === beacon.iBeaconID ? (
                                <>
                                    <td><input type="text" name="MacAddress" value={editFormData.MacAddress} onChange={handleEditFormChange} /></td>
                                    {/* <td><input type="text" name="BleNo" value={editFormData.BleNo} onChange={handleEditFormChange} /></td>
                                    <td><input type="text" name="BleName" value={editFormData.BleName} onChange={handleEditFormChange} /></td>
                                    <td><input type="text" name="iBeaconUuid" value={editFormData.iBeaconUuid} onChange={handleEditFormChange} /></td>
                                    <td><input type="text" name="iBeaconMajor" value={editFormData.iBeaconMajor} onChange={handleEditFormChange} /></td>
                                    <td><input type="text" name="iBeaconMinor" value={editFormData.iBeaconMinor} onChange={handleEditFormChange} /></td>
                                    <td><input type="text" name="Rssi" value={editFormData.Rssi} onChange={handleEditFormChange} /></td>
                                    <td><input type="text" name="iBeaconTxPower" value={editFormData.iBeaconTxPower} onChange={handleEditFormChange} /></td>
                                    <td><input type="text" name="Battery" value={`${editFormData.Battery}%`} onChange={handleEditFormChange} /></td> */}
                                    <td>
                                       

                                        <div className='containerButton'>
                                    <img onClick={() => handleSaveClick(beacon.iBeaconID)} src='/img/save.png'/>
                                    <img onClick={handleCancelClick} src='/img/cancelled.png'/></div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{beacon.MacAddress}</td>
                                    {/* <td>{beacon.BleNo}</td>
                                    <td>{beacon.BleName}</td>
                                    <td>{beacon.iBeaconUuid}</td>
                                    <td>{beacon.iBeaconMajor}</td>
                                    <td>{beacon.iBeaconMinor}</td>
                                    <td>{beacon.Rssi}</td>
                                    <td>{beacon.iBeaconTxPower}</td>
                                    <td>{beacon.Battery}%</td> */}
                                    <td>
                                    <div className='containerButton'>
                                    

                                    <img onClick={() => handleEditClick(beacon)} src='/img/edit.png'/>

                                    <img  onClick={() => handleDelete(beacon.iBeaconID)} src='/img/delete.png'/>
                                      
                                    </div>
                                       
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});
