import net from "net";

export class ClienteTCP {
  socket;
  ip = "127.0.0.1";

  constructor() {}

  enviarMensaje(mensaje, puerto, connectSuccessCallBack) {
    this.socket = new net.Socket();

    this.socket.on("error", (error) => {
      if (error.code != "ECONNREFUSED") {
        console.log(`Ocurrio un error: ${error}`);
      }
    });

    this.socket.on("connect", () => {
      if (connectSuccessCallBack) {
        connectSuccessCallBack();
      }
    });

    this.socket.connect(puerto, this.ip, () => {});

    this.socket.write(mensaje, (error) => {
      if (error) {
        console.log("Ocurrio un error al enviar el mensaje " + error.message);
      } else {
        this.socket.end();
      }
    });
  }
}
