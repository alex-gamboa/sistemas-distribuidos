import { Eventos } from "../ui/ui-event-bus.js";

export class JuegoSkeleton {
  state;
  uiBus;

  constructor(juegoState, uiBus) {
    this.state = juegoState;
    this.uiBus = uiBus;
  }

  async seleccionarCasilla(casilla) {
    this.state.casillas[parseInt(casilla)].seleccionada = true;
    this.state.casillas[parseInt(casilla)].jugador =
      this.state.contrincante.nombre;

    this.state.turno = this.state.jugador;

    this.uiBus.enviarEvento(Eventos.CasillaSeleccionada, {
      casilla: casilla,
      simbolo: this.state.contrincante.simbolo,
    });
  }

  iniciarJuego() {
    this.state.estado = "jugando";
    this.state.turno = this.state.contrincante;

    this.uiBus.enviarEvento(Eventos.JuegoIniciado, {
      jugador: this.state.jugador.nombre,
      contrincante: this.state.contrincante.nombre,
    });
  }

  finalizarJuego(ganador) {
    this.state.nuevo();

    this.uiBus.enviarEvento(Eventos.Ganador, ganador);
  }

  unmarshall(data) {
    const mensaje = JSON.parse(data);

    switch (mensaje.comando) {
      case "iniciarJuego":
        this.iniciarJuego();
        break;
      case "finalizarJuego":
        this.finalizarJuego(mensaje.datos.ganador);
        break;
      case "seleccionarCasilla":
        this.seleccionarCasilla(mensaje.datos.casilla);
        break;
      default:
        break;
    }
  }
}
