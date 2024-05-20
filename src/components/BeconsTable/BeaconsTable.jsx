import React, { useState, useContext, useEffect, memo } from 'react';
import { BeaconContext } from '../../Context/BeaconProvider';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import "./BeaconsTable.css";

Modal.setAppElement('#root'); // Asegúrate de que el id coincida con el id del elemento root en tu index.html

export const BeaconsTable = memo(() => {
    const { beacons, fetchBeacons } = useContext(BeaconContext);
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
    const [filteredData, setFilteredData] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        MacAddress: ''
    });

    useEffect(() => {
        setFilteredData(beacons);
    }, [beacons]);

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

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const applyFilters = () => {
        const filtered = beacons.filter(beacon => {
            return beacon.MacAddress.toLowerCase().includes(filters.MacAddress.toLowerCase());
        });
        setFilteredData(filtered);
    };

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Beacons");
        XLSX.writeFile(workbook, "filtered_beacons.xlsx");
    };

    return (
        <div>
            <div>
                <h2 className='tituloTabla'>BEACONS REGISTRADOS</h2>
                <button onClick={() => setModalIsOpen(true)}>Filtrar y Descargar</button>
            </div>
            <table className='tabla'>
                <thead>
                    <tr>
                        <th>MAC Address</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(beacon => (
                        <tr key={beacon.iBeaconID}>
                            {editingId === beacon.iBeaconID ? (
                                <>
                                    <td><input type="text" name="MacAddress" value={editFormData.MacAddress} onChange={handleEditFormChange} /></td>
                                    <td>
                                        <div className='containerButton'>
                                            <img onClick={() => handleSaveClick(beacon.iBeaconID)} src='/img/save.png' alt="Guardar" />
                                            <img onClick={handleCancelClick} src='/img/cancelled.png' alt="Cancelar" />
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{beacon.MacAddress}</td>
                                    <td>
                                        <div className='containerButton'>
                                            <img onClick={() => handleEditClick(beacon)} src='/img/edit.png' alt="Editar" />
                                            <img onClick={() => handleDelete(beacon.iBeaconID)} src='/img/delete.png' alt="Eliminar" />
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Filtrar y Descargar"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Filtrar Beacons</h2>
                <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
                <div className="filters">
                    <label>
                        MAC Address:
                        <input type="text" name="MacAddress" value={filters.MacAddress} onChange={handleFilterChange} />
                    </label>
                    <button onClick={applyFilters}>Aplicar Filtros</button>
                </div>
                <button onClick={handleDownload}>Descargar en Excel</button>
                <div className="modal-content">
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th>MAC Address</th>
                                <th>BLE No</th>
                                <th>BLE Name</th>
                                <th>UUID</th>
                                <th>Major</th>
                                <th>Minor</th>
                                <th>RSSI</th>
                                <th>Tx Power</th>
                                <th>Battery</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(beacon => (
                                <tr key={beacon.iBeaconID}>
                                    <td>{beacon.MacAddress}</td>
                                    <td>{beacon.BleNo}</td>
                                    <td>{beacon.BleName}</td>
                                    <td>{beacon.iBeaconUuid}</td>
                                    <td>{beacon.iBeaconMajor}</td>
                                    <td>{beacon.iBeaconMinor}</td>
                                    <td>{beacon.Rssi}</td>
                                    <td>{beacon.iBeaconTxPower}</td>
                                    <td>{beacon.Battery}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    );
});

export default BeaconsTable;
