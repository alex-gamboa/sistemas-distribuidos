import getPort from "get-port";

export const obtenerNodoServidor = async () => {
  let nodos = [
    {
      nombre: "Alex Gambo",
      puerto: 7001,
    },
    {
      nombre: "Profesor Jeovani",
      puerto: 7002,
    },
    {
      nombre: "Compañero Daniel",
      puerto: 7003,
    },
  ];

  const puerto = await getPort({
    port: [nodos[0].puerto, nodos[1].puerto, nodos[2].puerto],
  });

  for (const nodo of nodos) {
    if (nodo.puerto == puerto) {
      return nodo;
    }
  }
};

export const obtenerPuertoParaUI = async () => {
  const port = await getPort({
    port: [3000, 3001, 3002],
  });

  return port;
};
