import net from "net";
import { obtenerPuertoDisponible } from "./utils.js";

export class ClienteTCP {
  ip = "127.0.0.1";
  ipBusDeMensajes = "127.0.0.1";
  puertoBusDeMensajes = 7000;
  puertoEscucha;

  constructor() {}

  async inicializar() {
    const puerto = await obtenerPuertoDisponible();
    this.puertoEscucha = puerto;
    this.suscribirABusDeMensajes();
  }

  suscribirABusDeMensajes() {
    this.servidor = net.createServer();

    this.servidor.on("connection", (conn) => {
      conn.on("data", (msg) => {
        console.log(`Mesaje recibido: ${msg}`);
      });

      conn.on("error", (error) => {
        console.log(`Ocurrio un error: ${error}`);
      });
    });

    this.servidor.listen(this.puertoEscucha, this.ip, () => {
      console.log(`escuchando en: ${this.ip}:${this.puertoEscucha}`);
    });

    this.enviarMensaje(
      JSON.stringify({
        tipo: "suscripcion",
        datosSuscriptor: {
          ip: this.ip,
          puerto: this.puertoEscucha,
        },
      })
    );
  }

  enviarMensaje(mensaje) {
    this.socket = new net.Socket();

    this.socket.connect(this.puertoBusDeMensajes, this.ipServidor);

    this.socket.write(mensaje, (error) => {
      if (error) {
        console.log("Ocurrio un error al enviar el mensaje " + error.message);
      } else {
        this.socket.end();
      }
    });
  }
}

const cliente = new ClienteTCP();

await cliente.inicializar();

cliente.enviarMensaje(
  JSON.stringify({
    tipo: "mensaje",
    mensaje: `Hola desde ${cliente.ip}:${cliente.puertoEscucha}`,
  })
);
