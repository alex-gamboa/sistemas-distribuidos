import { Server } from "socket.io";

export const Eventos = {
  IniciarJuego: "iniciar_juego",
  JuegoIniciado: "juego_iniciado",
  SeleccionarCasilla: "seleccionar_casilla",
  CasillaSeleccionada: "casilla_seleccionada",
  Error: "error",
  FinalizarJuego: "finalizar_juego",
  Ganador: "ganador",
};

export class UiEventBus {
  io;
  juego;

  constructor(httpServer, juego) {
    this.io = new Server(httpServer);
    this.juego = juego;
    this.iniciarManejadorDeEventos();

    this.juego.ganadorCallBack = (ganador) => {
      this.enviarEvento(Eventos.Ganador, ganador);
    };

    this.juego.juegoIniciadoCallback = (jugadores) => {
      this.enviarEvento(Eventos.JuegoIniciado, jugadores);
    };
  }

  iniciarManejadorDeEventos() {
    this.io.on("connection", (socket) => {
      socket.on(Eventos.IniciarJuego, (msg) => {
        this.juego
          .iniciarJuego()
          .catch((e) => this.io.emit(Eventos.Error, e.message));
      });

      socket.on(Eventos.SeleccionarCasilla, (msg) => {
        this.juego
          .seleccionarCasilla(msg)
          .then((_) =>
            this.io.emit(Eventos.CasillaSeleccionada, {
              simbolo: this.juego.state.jugador.simbolo,
              casilla: msg,
            })
          )
          .catch((e) => this.io.emit(Eventos.Error, e.message));
      });
    });
  }

  enviarEvento(evento, payload) {
    this.io.emit(evento, payload);
  }
}
