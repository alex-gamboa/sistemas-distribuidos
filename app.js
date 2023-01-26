import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Worker } from "worker_threads";
import { ClienteTCP } from "./cliente.js";
import { obtenerPuertoParaUI } from "./utils.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const clienteTCP = new ClienteTCP();
const servidorThread = new Worker("./servidor.js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

servidorThread.on("message", (data) => {
  if (data.nombre) {
    clienteTCP.establecerNodo(data);
  } else {
    io.emit("mensaje_recibido", data);
  }
});

servidorThread.on("error", (msg) => {
  console.log(`Ocurrio un error al recibir el mensaje: ${msg}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/ui.html");
});

io.on("connection", (socket) => {
  socket.on("enviar_mensaje", (msg) => {
    //io.emit("chat message", msg);

    //enviar mensaje a los otros nodos
    clienteTCP.enviarMensaje(msg);
  });
});

const puerto = await obtenerPuertoParaUI();

server.listen(puerto, () => {
  console.log(`backend de UI escuchando en 127.0.0.1:${puerto}`);
});
