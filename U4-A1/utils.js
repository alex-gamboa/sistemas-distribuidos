import getPort from "get-port";

export const obtenerPuertoDisponible = async () => {
  let puertos = [];

  for (let index = 7001; index < 8000; index++) {
    puertos.push(index);
  }

  const puerto = await getPort({
    port: puertos,
  });

  return puerto;
};
