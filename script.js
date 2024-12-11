
let prizeDoor, selectedDoor, revealedDoor;
let gamesPlayed = 0;
let wins = 0;
let losses = 0;

const doorsContainer = document.getElementById('doors-container');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');
const autoPlayBtn = document.getElementById('auto-play-btn');
const gamesPlayedElement = document.getElementById('games-played');
const winsElement = document.getElementById('wins');
const lossesElement = document.getElementById('losses'); 
const winPercentageElement = document.getElementById('win-percentage');
const winProgress = document.getElementById('win-progress');
const loseProgress = document.getElementById('lose-progress');

const resetStatsBtn = document.getElementById('reset-stats-btn');
resetStatsBtn.onclick = resetStats;
const container = document.querySelector('.container'); // Contenedor principal


function initGame() {
    resetDoors();
    prizeDoor = Math.floor(Math.random() * 3) + 1;
    selectedDoor = null;
    revealedDoor = null;
    message.textContent = 'Selecciona una puerta';
    resetBtn.style.display = 'none';

    // Establece la fase inicial
    setPhase('selection');

    // Asignar eventos de clic a cada puerta
    Array.from(doorsContainer.children).forEach((door, index) => {
        const doorNumber = index + 1; // El índice comienza en 0, ajustamos para 1, 2, 3
        door.onclick = () => selectDoor(doorNumber);
        door.style.backgroundColor = ''; // Restablecer el color de las puertas
    });
}


function setPhase(phase) {
    // Elimina clases de fase existentes
    container.classList.remove('selection-phase', 'reveal-phase', 'final-phase');

    // Agrega la clase de la fase actual
    if (phase === 'selection') {
        container.classList.add('selection-phase');
    } else if (phase === 'reveal') {
        container.classList.add('reveal-phase');
    } else if (phase === 'final') {
        container.classList.add('final-phase');
    }
}
function resetStats() {
    gamesPlayed = 0;
    wins = 0;
    losses = 0;

    // Actualizar las estadísticas en el DOM
    gamesPlayedElement.textContent = gamesPlayed;
    winsElement.textContent = wins;
    lossesElement.textContent = losses;

    // Reiniciar las barras de progreso
    winProgress.style.width = '0%';
    loseProgress.style.width = '0%';
    winProgress.textContent = '';
    loseProgress.textContent = '';
}



function resetDoors() {
    Array.from(doorsContainer.children).forEach(door => {
        door.className = 'door';
        door.style.backgroundColor = ''; // Restablece colores
        door.querySelector('.door-content').style.transform = ''; // Restablece rotación
        door.onclick = null; // Limpia cualquier evento de clic previo
    });
}



function selectDoor(doorNumber) {
    if (selectedDoor) return;
    selectedDoor = doorNumber;
    document.querySelector(`[data-door="${doorNumber}"]`).classList.add('selected');
    revealDoor();
}

function revealDoor() {
    do {
        revealedDoor = Math.floor(Math.random() * 3) + 1;
    } while (revealedDoor === selectedDoor || revealedDoor === prizeDoor);

    document.querySelector(`[data-door="${revealedDoor}"]`).classList.add('revealed', 'open');
    message.textContent = '¿Quieres mantener tu elección o cambiar de puerta?';

    const keepBtn = document.createElement('button');
    keepBtn.textContent = 'Mantener';
    keepBtn.classList.add('keep-btn'); // Agregar clase para estilización
    keepBtn.onclick = () => finishGame(false);

    const switchBtn = document.createElement('button');
    switchBtn.textContent = 'Cambiar';
    switchBtn.classList.add('switch-btn'); // Agregar clase para estilización
    switchBtn.onclick = () => finishGame(true);

    message.appendChild(document.createElement('br'));
    message.appendChild(keepBtn);
    message.appendChild(switchBtn);

    // Establece la fase de revelación
    setPhase('reveal');
}

function finishGame(switched) {
    const finalDoor = switched ? (6 - selectedDoor - revealedDoor) : selectedDoor;
    const won = finalDoor === prizeDoor;

    gamesPlayed++;
    if (won) {
        wins++;
        document.querySelector(`[data-door="${prizeDoor}"]`).style.backgroundColor = '#4caf50'; // Verde
    } else {
        losses++;
        document.querySelector(`[data-door="${selectedDoor}"]`).style.backgroundColor = '#f44336'; // Rojo
    }

    Array.from(doorsContainer.children).forEach(door => {
        door.onclick = null;
        const doorNumber = parseInt(door.dataset.door);
        if (doorNumber === prizeDoor) {
            door.classList.add('prize', 'open');
        } else if (doorNumber !== revealedDoor) {
            door.classList.add('revealed', 'open');
        }
    });

    message.textContent = won ? '¡Ganaste!' : 'Lo siento, perdiste.';
    resetBtn.style.display = 'inline-block';
    updateStats();
}



function updateStats() {
    // Actualiza los contadores de partidas, victorias y derrotas
    gamesPlayedElement.textContent = gamesPlayed;
    winsElement.textContent = wins;
    lossesElement.textContent = losses; // Actualiza el contador de derrotas

    // Calcula porcentajes
    const winPercentage = gamesPlayed > 0 ? (wins / gamesPlayed * 100).toFixed(2) : 0;
    const losePercentage = gamesPlayed > 0 ? (100 - winPercentage).toFixed(2) : 0;

    // Actualiza las barras
    winProgress.style.width = winPercentage + '%';
    loseProgress.style.width = losePercentage + '%';

    // Muestra porcentajes en las barras
    winProgress.textContent = winPercentage + '%';
    loseProgress.textContent = losePercentage + '%';
}

// Ejemplo: Incrementar derrotas
function addLoss() {
    gamesPlayed++;
    losses++;
    updateStats();
}

// Ejemplo: Incrementar victorias
function addWin() {
    gamesPlayed++;
    wins++;
    updateStats();
}


// Botón "Reiniciar estadísticas" para restablecer todo
resetBtn.onclick = () => {
    gamesPlayed = 0;
    wins = 0;
    winProgress.style.width = '0%';
    loseProgress.style.width = '0%';
    winProgress.textContent = '';
    loseProgress.textContent = '';
    updateStats();
    initGame();
};

function openDoor(doorId) {
    const door = document.getElementById(doorId);
    door.classList.add("open");
}



function autoPlay() {
    resetDoors();
    prizeDoor = Math.floor(Math.random() * 3) + 1;
    selectedDoor = Math.floor(Math.random() * 3) + 1;

    do {
        revealedDoor = Math.floor(Math.random() * 3) + 1;
    } while (revealedDoor === selectedDoor || revealedDoor === prizeDoor);

    const switched = true;
    finishGame(switched);
}

resetBtn.onclick = initGame;
autoPlayBtn.onclick = autoPlay;

initGame();
