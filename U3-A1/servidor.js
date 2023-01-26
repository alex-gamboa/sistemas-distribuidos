import net from "net";
import { obtenerNodoServidor } from "./utils.js";
import { parentPort } from "worker_threads";

class ServidorTCP {
  servidor;
  ip = "127.0.0.1";

  constructor() {
    this.iniciarServidor();
  }

  iniciarServidor() {
    obtenerNodoServidor().then((nodo) => {
      this.servidor = net.createServer();

      parentPort.postMessage(nodo);

      this.servidor.on("connection", (conn) => {
        conn.on("data", (data) => {
          parentPort.postMessage(data.toString());
        });

        conn.on("error", (error) => {
          console.log(`Ocurrio un error: ${error}`);
        });
      });

      this.servidor.listen(nodo.puerto, this.ip, () => {
        console.log(`${nodo.nombre} escuchando en: ${this.ip}:${nodo.puerto}`);
      });
    });
  }
}

const servidor = new ServidorTCP();
