import net from "net";

class BusDeMensajes {
  servidor;
  ip = "127.0.0.1";
  puerto = 7000;
  suscriptores = [];

  constructor() {
    this.iniciarServidor();
  }

  iniciarServidor() {
    this.servidor = net.createServer();

    this.servidor.on("connection", (conn) => {
      conn.on("data", (data) => {
        const msg = JSON.parse(data);

        if (msg.tipo == "suscripcion") {
          this.suscriptores.push(msg.datosSuscriptor);
          console.log(
            `Nuevo suscriptor: ${msg.datosSuscriptor.ip}:${msg.datosSuscriptor.puerto}`
          );
        }

        if (msg.tipo == "mensaje") {
          console.log(`Mensaje recibido: ${msg.mensaje}`);
          this.enviarMensaje(msg.mensaje);
        }
      });

      conn.on("error", (error) => {
        console.log(`Ocurrio un error: ${error}`);
      });
    });

    this.servidor.listen(this.puerto, this.ip, () => {
      console.log(`Bus de mensajes escuchando en: ${this.ip}:${this.puerto}`);
    });
  }

  enviarMensaje(mensaje) {
    for (const suscriptor of this.suscriptores) {
      let socket = new net.Socket();

      socket.connect(suscriptor.puerto, suscriptor.ip, () => {
        console.log(
          `Reenviando mensaje a ${suscriptor.ip}:${suscriptor.puerto}`
        );
      });

      socket.write(mensaje, (error) => {
        if (error) {
          console.log("Ocurrio un error al enviar el mensaje " + error.message);
        } else {
          socket.end();
        }
      });
    }
  }
}

const bus = new BusDeMensajes();
