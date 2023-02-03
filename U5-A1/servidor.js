import net from "net";
import { parentPort, workerData } from "worker_threads";

class ServidorTCP {
  servidor;
  ip = "127.0.0.1";

  constructor() {
    this.iniciarServidor();
  }

  iniciarServidor() {
    this.servidor = net.createServer();

    this.servidor.on("connection", (conn) => {
      conn.on("data", (data) => {
        parentPort.postMessage(data.toString());
      });

      conn.on("error", (error) => {
        console.log(`Ocurrio un error: ${error}`);
      });
    });

    this.servidor.listen(workerData.puerto, this.ip, () => {
      console.log(
        `${workerData.nombre} escuchando en: ${this.ip}:${workerData.puerto}`
      );
    });
  }
}

const servidor = new ServidorTCP();
