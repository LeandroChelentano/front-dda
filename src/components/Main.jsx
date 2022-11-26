import React, { useEffect, useState } from "react";
import Box from "./Box";

import {
  assignPlan,
  unassignPlan,
  deleteCliente,
  getClientes,
  getPlanes,
  newCliente,
  updateCliente,
  deletePlan,
  newPlan,
  updatePlan,
} from "../fetching";
import Modal from "./Modal";

export default function Main() {
  const [clientes, setClientes] = useState(null);
  const [planes, setPlanes] = useState(null);

  const [selectedClientIdOnList, setSelectedClientIdOnList] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const [selectedPlanIdOnList, setSelectedPlanIdOnList] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [selectedActivePlan, setSelectedActivePlan] = useState(null);
  const [selectedUnactivePlan, setSelectedUnactivePlan] = useState(null);

  const [showingDetails, setShowingDetails] = useState(null);

  useEffect(() => {
    (async () => {
      if (!clientes) setClientes(await getClientes());
      if (!planes) setPlanes(await getPlanes());
    })();
  }, [clientes, planes]);

  const handleSelectClient = () => {
    clientes?.forEach((client) => {
      if (client.id === selectedClientIdOnList) setSelectedClient(client);
    });
  };

  const handleDetailsClient = () => {
    clientes?.forEach((client) => {
      if (client.id === selectedClientIdOnList) setSelectedClient(client);
    });
    setShowingDetails(true);
  };

  const handleSelectPlan = () => {
    planes?.forEach((plan) => {
      if (plan.id === selectedPlanIdOnList) setSelectedPlan(plan);
    });
  };

  const clearClients = () => {
    setSelectedClient(null);
    setSelectedClientIdOnList(null);
    setSelectedActivePlan(null);
    setSelectedUnactivePlan(null);
    document.querySelector("#listaRebelde").selectedIndex = 0;
  };

  const clearPlanes = () => {
    setSelectedPlan(null);
    setSelectedPlanIdOnList(null);
    setSelectedActivePlan(null);
    setSelectedUnactivePlan(null);
  };

  const handleDeleteClient = async () => {
    const req = await deleteCliente(selectedClientIdOnList);
    if (req.status !== 500) {
      const arr = [];
      clientes.forEach((c) => {
        if (c.id !== selectedClientIdOnList) arr.push(c);
      });
      setClientes(arr);
      clearClients();
    }
  };

  const handleDeletePlan = async () => {
    const req = await deletePlan(selectedPlanIdOnList);
    if (req.status !== 500) {
      const arr = [];
      planes.forEach((p) => {
        if (p.id !== selectedPlanIdOnList) arr.push(p);
      });
      setPlanes(arr);
      clearPlanes();
    } else {
      alert(
        "El plan no puede ser eliminado porque hay clientes que lo han comprado."
      );
    }
  };

  const handleClientClear = () => {
    clearClients();
  };

  const handlePlanClear = () => {
    clearPlanes();
  };

  const handleClientSave = async () => {
    if (
      !selectedClient.nombre ||
      !selectedClient.apellido ||
      !selectedClient.email ||
      !selectedClient.ci
    ) {
      alert("Hay elementos en blanco");
      return;
    }

    let req;
    if (selectedClientIdOnList === null) {
      //* new client
      req = await newCliente(selectedClient);
      if (req.status !== 500) {
        const arr = clientes;
        arr.push(req);
        setClientes(arr);
        clearClients();
      }
    } else {
      //* update client
      req = await updateCliente(selectedClientIdOnList, selectedClient);
      if (req.status !== 500) {
        const arr = [];
        clientes.forEach((c) => {
          arr.push(c.id === selectedClientIdOnList ? req : c);
        });
        setClientes(arr);
        clearClients();
      }
    }

    if (req.status === 500 || req.status === 400)
      alert("El email y la cedula deben ser unicos entre los clientes.");
  };

  const handlePlanSave = async () => {
    if (
      !selectedPlan.destino ||
      !selectedPlan.fecha ||
      !selectedPlan.modalidad ||
      !selectedPlan.precio
    ) {
      alert("Hay elementos en blanco");
      return;
    }

    let fecha = selectedPlan.fecha.toString();
    selectedPlan.fecha = fecha;

    let req;
    try {
      if (selectedPlanIdOnList === null) {
        //* new plan
        req = await newPlan(selectedPlan);
        if (req.status !== 500 || req.status !== 400) {
          const arr = planes;
          arr.push(req);
          setPlanes(arr);
          clearPlanes();
        }
      } else {
        //* update plan
        req = await updatePlan(selectedPlanIdOnList, selectedPlan);
        if (req.status !== 500 || req.status !== 400) {
          const arr = [];
          planes.forEach((p) => {
            arr.push(p.id === selectedPlanIdOnList ? req : p);
          });
          setPlanes(arr);
          clearPlanes();
        }
      }
    } catch {
      alert("No puedes añadir un plan con una fecha anterior a la actual.");
    }
  };

  const handleClientSelectClick = async (e) => {
    const val = e.target.value;
    if (val) setSelectedClientIdOnList(parseInt(val));
  };

  const handlePlanSelectClick = async (e) => {
    const val = e.target.value;
    if (val === undefined) return;
    if (val) setSelectedPlanIdOnList(parseInt(val));
  };

  const getNotBoughtTravels = () => {
    if (selectedClient?.id === undefined) return [];

    const arr = [];
    planes?.forEach((p) => {
      let founded = false;
      selectedClient?.viajes?.forEach((v) => {
        if (p.id === v.id) founded = true;
      });
      if (!founded) arr.push(p);
    });
    return arr;
  };

  const handleAssignPlan = async () => {
    if (selectedClient === null || selectedUnactivePlan === null) return;

    const req = await assignPlan(selectedClientIdOnList, selectedUnactivePlan);
    console.log(req);
    if (req.status !== 500) {
      const arr = [];
      clientes.forEach((c) => {
        arr.push(c.id === selectedClientIdOnList ? req : c);
      });
      setClientes(arr);
      clearClients();
    }

    if (req.status === 500 || req.status === 400)
      alert("Ha ocurrido un error.");
  };

  const handleUnassignPlan = async () => {
    if (selectedClient === null || selectedActivePlan === null) return;

    const req = await unassignPlan(selectedClientIdOnList, selectedActivePlan);
    if (req.status !== 500) {
      const arr = [];
      clientes.forEach((c) => {
        if (c.id !== selectedClientIdOnList) {
          arr.push(c);
          return;
        }

        const viajes = [];
        c.viajes.forEach((v) => {
          if (v.id !== selectedActivePlan) viajes.push(v);
        });
        c.viajes = viajes;
        arr.push(c);
      });
      setClientes(arr);
      clearClients();
    }

    if (req.status === 500 || req.status === 400)
      alert("Ha ocurrido un error.");
  };

  const modalidades = ["terrestre", "aereo", "maritimo"];

  return (
    <>
      <Modal
        cliente={selectedClient}
        showing={showingDetails}
        setShowing={setShowingDetails}
      />
      <header>
        <img
          src="https://icon-icons.com/downloadimage.php?id=3015&root=37/PNG/96/&file=plane_takeoff_3577.png"
          alt="Logo"
          className="logo"
          draggable={false}
        />
        <p>Por: Leandro Chelentano y Guadalupe Dovat.</p>
      </header>
      <main>
        <Box title="Listado de Clientes" w={250} h={200}>
          <select
            className="select"
            multiple={true}
            onClick={(e) => handleClientSelectClick(e)}
            onChange={(e) => handleClientSelectClick(e)}
          >
            {clientes?.map((c) => {
              return (
                <option
                  key={c.id}
                  value={c.id}
                  selected={c.id === selectedClientIdOnList}
                >
                  {c.nombre} {c.apellido}
                </option>
              );
            })}
          </select>
          <footer>
            <button onClick={handleSelectClient}>Seleccionar</button>
            <button onClick={handleDetailsClient}>Revisar</button>
            <button onClick={handleDeleteClient}>Eliminar</button>
          </footer>
        </Box>
        <Box
          title={
            selectedClient?.id !== undefined
              ? "Datos del Cliente"
              : "Nuevo Cliente"
          }
          w={280}
          p={true}
        >
          <div className="center-x">
            <table>
              <tbody>
                <tr>
                  <td>
                    <p>Nombre</p>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={selectedClient?.nombre || ""}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          nombre: e.target.value,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Apellido</p>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={selectedClient?.apellido || ""}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          apellido: e.target.value,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Cedula</p>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={selectedClient?.ci || ""}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          ci: e.target.value,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Email</p>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={selectedClient?.email || ""}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          email: e.target.value,
                        })
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedClient?.premium || false}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          premium: e.target.checked,
                        })
                      }
                    />
                    <p style={{ display: "inline" }}> Es Premium</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <footer>
            <button onClick={handleClientSave}>Guardar</button>
            <button onClick={handleClientClear}>Limpiar</button>
          </footer>
        </Box>
        <Box title="Viajes del Cliente" w={300}>
          <select
            className="select"
            multiple={true}
            onChange={(e) => {
              setSelectedActivePlan(parseInt(e.target.value));
            }}
          >
            {selectedClient?.viajes?.map((p) => {
              return (
                <option key={p.id} value={p.id}>
                  {p.destino} - {p?.fecha?.replaceAll("-", "/")}
                </option>
              );
            })}
          </select>
          <footer>
            <button onClick={handleUnassignPlan}>Darse de baja</button>
          </footer>
          <select
            className="select"
            multiple={true}
            onChange={(e) => {
              setSelectedUnactivePlan(parseInt(e.target.value));
            }}
          >
            {getNotBoughtTravels().map((p) => {
              return (
                <option key={p.id} value={p.id}>
                  {p.destino} - {p?.fecha?.replaceAll("-", "/")}
                </option>
              );
            })}
          </select>
          <footer>
            <button onClick={handleAssignPlan}>Contratar</button>
          </footer>
        </Box>
        <Box title="Listado de Planes" w={250} h={200}>
          <select
            className="select"
            multiple={true}
            onChange={(e) => handlePlanSelectClick(e)}
            onClick={(e) => handlePlanSelectClick(e)}
          >
            {planes?.map((p) => {
              return (
                <option key={p.id} value={p.id}>
                  {p.destino} - {p?.fecha?.replaceAll("-", "/")}
                </option>
              );
            })}
          </select>
          <footer>
            <button onClick={handleSelectPlan}>Seleccionar</button>
            <button onClick={handleDeletePlan}>Eliminar</button>
          </footer>
        </Box>
        <Box title="Datos del Plan" w={280} p={true}>
          <div className="center-x">
            <table>
              <tbody>
                <tr>
                  <td>
                    <p>Destino</p>
                  </td>
                  <td>
                    <input
                      type="text"
                      onChange={(e) =>
                        setSelectedPlan({
                          ...selectedPlan,
                          destino: e.target.value,
                        })
                      }
                      value={selectedPlan?.destino || ""}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Fecha</p>
                  </td>
                  <td>
                    <input
                      type="date"
                      onChange={(e) =>
                        setSelectedPlan({
                          ...selectedPlan,
                          fecha: e.target.value,
                        })
                      }
                      value={selectedPlan?.fecha || ""}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Modalidad</p>
                  </td>
                  <td>
                    <select
                      className="simpleSelect"
                      onChange={(e) =>
                        setSelectedPlan({
                          ...selectedPlan,
                          modalidad: e.target.value,
                        })
                      }
                      id="listaRebelde"
                    >
                      <option selected={!selectedPlan?.modalidad}>
                        Seleccione una
                      </option>
                      {modalidades.map((m) => {
                        return (
                          <option
                            value={m}
                            key={m}
                            selected={m === selectedPlan?.modalidad}
                          >
                            {m[0].toUpperCase() + m.substring(1)}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Precio</p>
                  </td>
                  <td>
                    <input
                      type="number"
                      onChange={(e) =>
                        setSelectedPlan({
                          ...selectedPlan,
                          precio: e.target.value,
                        })
                      }
                      value={selectedPlan?.precio || ""}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <footer>
            <button onClick={handlePlanSave}>Guardar</button>
            <button onClick={handlePlanClear}>Limpiar</button>
          </footer>
        </Box>
      </main>
    </>
  );
}
