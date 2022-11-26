const BASE_URL = "http://localhost:8080";

//#region Clientes
export const getClientes = () => {
  return fetch(`${BASE_URL}/clientes`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const newCliente = (c) => {
  return fetch(`${BASE_URL}/clientes`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      nombre: c.nombre,
      apellido: c.apellido,
      cedula: c.cedula,
      email: c.email,
      ci: c.ci,
      isPremium: c.premium,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const updateCliente = (id, c) => {
  return fetch(`${BASE_URL}/clientes/${id}`, {
    headers: { "Content-Type": "application/json" },
    method: "PUT",
    body: JSON.stringify({
      nombre: c.nombre,
      apellido: c.apellido,
      cedula: c.cedula,
      email: c.email,
      ci: c.ci,
      isPremium: c.premium,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const deleteCliente = (clientId) => {
  return fetch(`${BASE_URL}/clientes/${clientId}`, {
    headers: { "Content-Type": "application/json" },
    method: "DELETE",
  });
};
// #endregion

//#region Relation
export const assignPlan = (clientId, planId) => {
  return fetch(`${BASE_URL}/relation`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      viaje: planId,
      cliente: clientId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const unassignPlan = (clientId, planId) => {
  return fetch(`${BASE_URL}/relation?cli=${clientId}&plan=${planId}`, {
    headers: { "Content-Type": "application/json" },
    method: "DELETE",
  });
};
//#endregion

//#region Planes
export const getPlanes = () => {
  return fetch(`${BASE_URL}/planes`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const newPlan = (p) => {
  return fetch(`${BASE_URL}/planes`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      destino: p.destino,
      fecha: p.fecha,
      modalidad: p.modalidad,
      precio: p.precio,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const updatePlan = (id, p) => {
  return fetch(`${BASE_URL}/planes/${id}`, {
    headers: { "Content-Type": "application/json" },
    method: "PUT",
    body: JSON.stringify({
      destino: p.destino,
      fecha: p.fecha,
      modalidad: p.modalidad,
      precio: p.precio,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const deletePlan = (id) => {
  return fetch(`${BASE_URL}/planes/${id}`, {
    headers: { "Content-Type": "application/json" },
    method: "DELETE",
  });
};
//#endregion
