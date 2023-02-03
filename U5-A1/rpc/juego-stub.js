import { ClienteTCP } from "../cliente.js";
import { Eventos } from "../ui/ui-event-bus.js";

export class JuegoStub {
  state;
  cliente = new ClienteTCP();
  ganadorCallBack;
  juegoIniciadoCallback;

  constructor(juegoState) {
    this.state = juegoState;
  }

  async seleccionarCasilla(casilla) {
    if (this.state.estado != "jugando") {
      throw new Error("El juego no ha sido iniciado");
    }

    if (this.state.turno != this.state.jugador) {
      throw new Error("No es tu turno");
    }

    if (this.state.casillas[parseInt(casilla)].seleccionada)
      throw new Error("La casilla ya fue seleccionada");

    const mensaje = {
      comando: "seleccionarCasilla",
      datos: {
        casilla: casilla,
      },
    };

    const onSuccess = () => {
      this.state.casillas[parseInt(casilla)].seleccionada = true;
      this.state.casillas[parseInt(casilla)].jugador =
        this.state.jugador.nombre;

      this.state.turno = this.state.contrincante;

      this.verificarResultado();
    };

    this.marshall(mensaje, onSuccess);
  }

  async iniciarJuego() {
    if (this.state.estado == "jugando")
      throw new Error("Un juego se esta jugando actualmente");

    const mensaje = {
      comando: "iniciarJuego",
      datos: {
        jugador: this.state.jugador,
      },
    };

    const onSuccess = () => {
      this.state.estado = "jugando";
      this.state.turno = this.state.jugador;
      this.juegoIniciadoCallback({
        jugador: this.state.jugador.nombre,
        contrincante: this.state.contrincante.nombre,
      });
    };

    this.marshall(mensaje, onSuccess);
  }

  finalizarJuego(ganador) {
    const mensaje = {
      comando: "finalizarJuego",
      datos: {
        ganador: ganador,
      },
    };

    const onSuccess = () => {
      this.state.nuevo();
    };

    this.marshall(mensaje, onSuccess);
  }

  verificarResultado() {
    let ganadores = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];

    for (const conjuntoGanador of ganadores) {
      if (this.state.casillas[conjuntoGanador[0]].jugador == "") continue;

      if (
        this.state.casillas[conjuntoGanador[0]].jugador ==
          this.state.casillas[conjuntoGanador[1]].jugador &&
        this.state.casillas[conjuntoGanador[0]].jugador ==
          this.state.casillas[conjuntoGanador[2]].jugador
      ) {
        const ganador = this.state.casillas[conjuntoGanador[0]].jugador;

        this.finalizarJuego(ganador);
        this.ganadorCallBack(ganador);

        break;
      }
    }
  }

  marshall(mensaje, onSuccess) {
    this.cliente.enviarMensaje(
      JSON.stringify(mensaje),
      this.state.contrincante.puerto,
      onSuccess
    );
  }
}
