import React, { useState } from "react";

export default function Modal({ cliente, showing, setShowing }) {
  const [firstPlanAfterDate, setFirstPlanAfterDate] = useState(null);

  console.log(cliente);

  const handleChange = (date) => {
    if (!cliente) return;

    date = new Date(date);
    let wasSupplied = false;

    cliente.viajes.forEach((v) => {
      if (date < new Date(v.fecha) && !wasSupplied) {
        let formatted = `[${v.id}] ${v.destino} - ${v.fecha.replaceAll(
          "-",
          "/"
        )} - USD ${v.precio}`;

        setFirstPlanAfterDate(formatted);
        wasSupplied = true;
      }
    });
  };

  return (
    <div className="modalBack" style={{ display: showing ? "flex" : "none" }}>
      <div className="modalMain">
        <h2>Proximo viaje desde:</h2>
        <input type="date" onChange={(e) => handleChange(e.target.value)} />
        <p>{firstPlanAfterDate || "No hay fecha seleccionada"}</p>
        <p className="close" onClick={() => setShowing(false)}>
          Cerrar
        </p>
      </div>
    </div>
  );
}
