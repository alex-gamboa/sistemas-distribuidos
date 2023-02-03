import express from "express";
import http from "http";
import { Worker, workerData } from "worker_threads";
import { obtenerJugadores, obtenerPuertoParaUI } from "./utils.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { JuegoStub } from "./rpc/juego-stub.js";
import { JuegoSkeleton } from "./rpc/juego-skeleton.js";
import { Juego } from "./juego.js";
import { UiEventBus } from "./ui/ui-event-bus.js";

const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const juegoState = new Juego();
const jugadores = await obtenerJugadores();

juegoState.jugador = jugadores.jugador;
juegoState.contrincante = jugadores.contrincante;

const juego = new JuegoStub(juegoState);
const uiBus = new UiEventBus(server, juego);
const juegoServer = new JuegoSkeleton(juegoState, uiBus);

const servidorThread = new Worker("./servidor.js", {
  workerData: {
    puerto: juegoState.jugador.puerto,
    nombre: juegoState.jugador.nombre,
  },
});

servidorThread.on("message", (data) => {
  juegoServer.unmarshall(data);
});

servidorThread.on("error", (msg) => {
  console.log(`Ocurrio un error al recibir el mensaje: ${msg}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/ui/ui.html");
});

const puerto = await obtenerPuertoParaUI();

server.listen(puerto, () => {
  console.log(
    `Para acceder a la UI porfavor abre tu navegador en: http://127.0.0.1:${puerto}`
  );
});
