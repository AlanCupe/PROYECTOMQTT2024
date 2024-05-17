import React, { useState, useContext, useEffect } from "react";
import Select from 'react-select';
import { AreaAssigmentContext } from "../../../Context/AreaAssigmentProvider";
import "./AreaAssingmentForm.css"

export const AreaAssingmentForm = () => {
  const { createAssignment, availableGateways, areas } = useContext(AreaAssigmentContext);
  const [formData, setFormData] = useState({
    macGateway: null,
    areaTrabajo: null,
    fechaAsignacion: ""
  });

  useEffect(() => {
    const localDateTime = new Date().toLocaleString('sv-SE').slice(0, 16);
    setFormData((prevData) => ({
      ...prevData,
      fechaAsignacion: localDateTime
    }));
  }, []);

  const handleChange = (selectedOption, { name }) => {
    setFormData({
      ...formData,
      [name]: selectedOption
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        macGateway: formData.macGateway ? formData.macGateway.value : "",
        areaTrabajo: formData.areaTrabajo ? formData.areaTrabajo.value : "",
        fechaAsignacion: formData.fechaAsignacion
      };
      await createAssignment(postData);
      setFormData({ macGateway: null, areaTrabajo: null, fechaAsignacion: "" });
    } catch (error) {
      console.error("Error al guardar la asignación", error);
    }
  };

  const gatewayOptions = availableGateways.map(gateway => ({
    value: gateway.MacAddress,
    label: gateway.MacAddress
  }));

  const areaOptions = areas.map(area => ({
    value: area.Nombre,
    label: area.Nombre
  }));

  return (
    <form onSubmit={handleSubmit} className="form-AsignacionBeacons">
      <div className="form-group">
        <Select
          className='select'
          name="macGateway"
          value={formData.macGateway}
          onChange={handleChange}
          options={gatewayOptions}
          placeholder="Seleccione un Gateway"
          isClearable
        />
      </div>
      <div className="form-group">
        <Select
          className='select'
          name="areaTrabajo"
          value={formData.areaTrabajo}
          onChange={handleChange}
          options={areaOptions}
          placeholder="Seleccione un Área"
          isClearable
        />
      </div>
      <div className="form-group input-group">
        <input
          className='input'
          type="datetime-local"
          name="fechaAsignacion"
          value={formData.fechaAsignacion}
          onChange={(e) => setFormData({ ...formData, fechaAsignacion: e.target.value })}
        />
       
      </div>
      <button className='button' type="submit">Asignar</button>
    </form>
  );
};

