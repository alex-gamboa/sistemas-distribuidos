export class Juego {
  estado; //jugando, finalizado, disponible
  jugador;
  contrincante;
  turno;

  casillas;

  constructor() {
    this.nuevo();
  }

  nuevo() {
    this.casillas = {
      1: {
        seleccionada: false,
        jugador: "",
      },
      2: {
        seleccionada: false,
        jugador: "",
      },
      3: {
        seleccionada: false,
        jugador: "",
      },
      4: {
        seleccionada: false,
        jugador: "",
      },
      5: {
        seleccionada: false,
        jugador: "",
      },
      6: {
        seleccionada: false,
        jugador: "",
      },
      7: {
        seleccionada: false,
        jugador: "",
      },
      8: {
        seleccionada: false,
        jugador: "",
      },
      9: {
        seleccionada: false,
        jugador: "",
      },
    };

    this.estado = "disponible";
    this.turno = null;
  }
}
