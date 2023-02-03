import getPort from "get-port";

export const obtenerJugadores = async () => {
  let nodos = [
    {
      nombre: "Alex Gambo",
      puerto: 7001,
      simbolo: "X",
    },
    {
      nombre: "Profesor Jeovani",
      puerto: 7002,
      simbolo: "O",
    },
  ];

  const puerto = await getPort({
    port: [nodos[0].puerto, nodos[1].puerto],
  });

  let jugador;
  let contrincante;

  for (const nodo of nodos) {
    if (nodo.puerto == puerto) {
      jugador = nodo;
    } else {
      contrincante = nodo;
    }
  }

  return { jugador: jugador, contrincante: contrincante };
};

export const obtenerPuertoParaUI = async () => {
  const port = await getPort({
    port: [3000, 3001],
  });

  return port;
};
