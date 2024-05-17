import React, { memo, useContext, useState } from 'react';
import { GatewayContext } from '../../../Context/GatewayProvider';

export const GatewayTable = memo(() => {
  const { gateways, updateGateway, deleteGateway } = useContext(GatewayContext);
  const [editGateway, setEditGateway] = useState(null);
  const [newMacAddress, setNewMacAddress] = useState('');
  const [error, setError]= useState('')

  const handleEdit = (gateway) => {
    setEditGateway(gateway);
    setNewMacAddress(gateway.MacAddress);
  };

  const handleDelete = async (id) => {
    await deleteGateway(id);
  };

  const handleSave = async () => {
    await updateGateway(editGateway.GatewayID, newMacAddress);
    setEditGateway(null);
  };
  const handleCancelClick = async() => {
  setEditGateway(null);
    setError('');
};

  return (
    <table className='tabla'>
      <thead>
        <tr>
          <th>MAC Address</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {gateways.map(gateway => (
          <tr key={gateway.GatewayID}>
            <td>
              {editGateway && editGateway.GatewayID === gateway.GatewayID ? (
                <input value={newMacAddress} onChange={e => setNewMacAddress(e.target.value)} />
              ) : (
                gateway.MacAddress
              )}
            </td>
            <td>
              {editGateway && editGateway.GatewayID === gateway.GatewayID ? (
                <div className='containerButton'>
                                    <img onClick={handleSave} src='/img/save.png'/>
                                    <img onClick={handleCancelClick} src='/img/cancelled.png'/>
                                    </div>
               
              ) : (
                <>
                  
                  <div className='containerButton'>
                                   <img onClick={() => handleEdit(gateway)}src='/img/edit.png'/>
                                    
                                   
                                    <img  onClick={() => handleDelete(gateway.GatewayID)}src='/img/delete.png'/>
                                   </div>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
