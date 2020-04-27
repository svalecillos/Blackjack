//Patron modulo
const miModulo = (() => {
    'use strict'

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
          especiales = ['A','J','Q','K'];

    let puntosJugadores = [];

    //Referencias para el html
    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');

    const crearDeck = () => {
        deck = [];
        for( let i = 2; i <= 10; i++){
            for(let tipo of tipos){
                deck.push( i + tipo);//-> añadimos cartas
            }
        }
        for( let tipo of tipos){
            for( let especial of especiales ){
                deck.push( especial + tipo );
            }
        }
        return _.shuffle( deck );//Barajea el deck;
    }

    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck();

        puntosJugadores = [];
        for( let i = 0; i < numJugadores; i++ ){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0);//Ponemos en 0 los puntos del jugador y de la pc

        divCartasJugadores.forEach(elem => elem.innerHTML = '');//Borramos las cartas tanto del jugador como de la pc

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }
    
    const pedirCarta = () => {
        if( deck.length === 0 ){
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    const valorCarta = ( carta ) => {
        //Extraemos del string los primeros valores exepto el ultimo
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor))? //si no es un numero
                ( valor === 'A') ? 11 : 10
                : valor * 1;//Si lo es entonces transforma el valor a numerico
    }

    //Metodo que acumula puntos de un jugador por medio del turno
    const acumularPuntos = ( carta, turnoJugador ) => {
        puntosJugadores[turnoJugador] = puntosJugadores[turnoJugador] + valorCarta( carta );
        puntosHTML[turnoJugador].innerText = puntosJugadores[turnoJugador];
        return puntosJugadores[turnoJugador];
    }

    const crearCarta = ( carta, turnoJugador ) => {
        const imgCarta = document.createElement('img');//Creamos un nuevo elemento en html
            //Añadimos atributos al elemento html
            imgCarta.src = `assets/cartas/${ carta }.png`;
            //Añadimos la clase al elemento
            imgCarta.classList.add('carta');
            //insertamos la imagen en el html
            divCartasJugadores[turnoJugador].append(imgCarta);
    }

    const determinarGanador = () => {
        
        const [ puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            if( puntosComputadora === puntosMinimos ){
                alert('Nadie gana');
            } else if( puntosMinimos > 21 ){
                alert('Computadora gana');
            }else if(puntosComputadora > 21){
                alert('Jugador gana');
            } else {
                alert('Computadora gana');
            }
        },10);
    }

    //Turno de la pc
    const turnoCumputadora = ( puntosMinimos ) => {

        let puntosComputadora = 0;
        
        do{
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta( carta, puntosJugadores.length - 1);

            if( puntosMinimos > 21){
                break;
            }
        }while( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21) );

        determinarGanador();
    }

    //Evento pedir carta
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( carta, 0);
        
        crearCarta( carta, 0);

        if( puntosJugador > 21){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoCumputadora(puntosJugador);
        } else if( puntosJugador === 21 ){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoCumputadora(puntosJugador);
        }
    });

    //evento detener
    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoCumputadora( puntosJugadores[0] );
    });

    //evento nuevo juego
    btnNuevo.addEventListener('click', () =>{
        inicializarJuego();
    });

    //Hacemos publico inicializarJuego para que se
    //pueda usar fuera del modulo
    return  {
        nuevoJuego: inicializarJuego
    };

})();


