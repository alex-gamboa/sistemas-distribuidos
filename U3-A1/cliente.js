import net from "net";

export class ClienteTCP {
  socket;
  nodo;
  ip = "127.0.0.1";

  constructor() {}

  establecerNodo(nodo) {
    this.nodo = nodo;
  }

  enviarMensaje(mensaje, indice) {
    let puertos = [7001, 7002, 7003];

    if (!indice) {
      indice = 0;
    }

    let puerto = puertos[indice];

    this.socket = new net.Socket();

    this.socket.on("error", (error) => {
      if (error.code != "ECONNREFUSED") {
        console.log(`Ocurrio un error: ${error}`);
      }
    });

    this.socket.connect(puerto, this.ip, () => {
      console.log(`Conectado a ${puerto}`);
    });

    this.socket.write(`${this.nodo.nombre} : ${mensaje}`, (error) => {
      if (error) {
        console.log("Ocurrio un error al enviar el mensaje " + error.message);
      } else {
        this.socket.end();
        if (indice < puertos.length - 1)
          this.enviarMensaje(mensaje, indice + 1);
      }
    });
  }
}
