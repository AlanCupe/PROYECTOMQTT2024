import React, { memo, useContext, useState } from "react";
import { AreaAssigmentContext } from "../../../Context/AreaAssigmentProvider";
import "./AreaAssignmentTable.css";

export const AreaAssignmentTable = memo( () => {
  const { assignments, availableGateways, areas, updateAssignment, deleteAssignment } = useContext(AreaAssigmentContext);
  const [editData, setEditData] = useState(null);

  const handleEdit = (item) => {
    setEditData(item);
  };

  const handleSave = async () => {
    try {
      await updateAssignment(editData.id, editData);
      setEditData(null);
    } catch (error) {
      console.error("Error saving data", error);
    }
  };
  const handleCancelClick = () => {
    setEditData(null);
};
  const handleDelete = async (id) => {
    try {
      await deleteAssignment(id);
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  const formatLocalDateTime = (dateTime) => {
    const localDate = new Date(dateTime);
    return localDate.toLocaleString();
  };

  return (
    <table>
      <thead>
        <tr>
          <th>MAC Gateway</th>
          <th>Área de Trabajo</th>
          <th>Fecha de Asignación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {assignments.map((item) => (
          <tr key={item.id}>
            <td>
              {editData && editData.id === item.id ? (
                <select
                  value={editData.macGateway}
                  onChange={(e) => setEditData({ ...editData, macGateway: e.target.value })}
                >
                  <option value="">Seleccione un Gateway</option>
                  {availableGateways.map((gateway) => (
                    <option key={gateway.GatewayID} value={gateway.MacAddress}>
                      {gateway.MacAddress}
                    </option>
                  ))}
                </select>
              ) : (
                item.macGateway
              )}
            </td>
            <td>
              {editData && editData.id === item.id ? (
                <select
                  value={editData.areaTrabajo}
                  onChange={(e) => setEditData({ ...editData, areaTrabajo: e.target.value })}
                >
                  <option value="">Seleccione un Área</option>
                  {areas.map((area) => (
                    <option key={area.AreaID} value={area.Nombre}>
                      {area.Nombre}
                    </option>
                  ))}
                </select>
              ) : (
                item.areaTrabajo
              )}
            </td>
            <td>{formatLocalDateTime(item.fechaAsignacion)}</td>
            <td>
              {editData && editData.id === item.id ? (
                  <div className='containerButton'>
                  <img onClick={handleSave} src='/img/save.png'/>
                  <img onClick={handleCancelClick} src='/img/cancelled.png'/></div>
               
              ) : (
                
                  
                  <div className='containerButton'>
                                    

                                    <img onClick={() => handleEdit(item)} src='/img/edit.png'/>

                                    <img onClick={() => handleDelete(item.id)} src='/img/delete.png'/>
                                      
                                    </div>
                                       
                
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
