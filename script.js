let prizeDoor, selectedDoor, revealedDoor;
let gamesPlayed = 0, wins = 0;

const doorsContainer = document.getElementById('doors-container');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');
const gamesPlayedElement = document.getElementById('games-played');
const winsElement = document.getElementById('wins');
const winPercentageElement = document.getElementById('win-percentage');

function initGame() {
    prizeDoor = Math.floor(Math.random() * 3) + 1;
    selectedDoor = null;
    revealedDoor = null;
    message.textContent = 'Selecciona una puerta';
    resetBtn.style.display = 'none';
    Array.from(doorsContainer.children).forEach(door => {
        door.className = 'door';
        door.querySelector('.door-content').style.transform = '';
        door.onclick = () => selectDoor(parseInt(door.dataset.door));
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
    keepBtn.onclick = () => finishGame(false);
    
    const switchBtn = document.createElement('button');
    switchBtn.textContent = 'Cambiar';
    switchBtn.onclick = () => finishGame(true);
    
    message.appendChild(document.createElement('br'));
    message.appendChild(keepBtn);
    message.appendChild(switchBtn);
}

function finishGame(switched) {
    const finalDoor = switched ? (6 - selectedDoor - revealedDoor) : selectedDoor;
    const won = finalDoor === prizeDoor;
    
    gamesPlayed++;
    if (won) wins++;
    
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
    gamesPlayedElement.textContent = gamesPlayed;
    winsElement.textContent = wins;
    const percentage = gamesPlayed > 0 ? (wins / gamesPlayed * 100).toFixed(2) : 0;
    winPercentageElement.textContent = percentage + '%';
}

resetBtn.onclick = initGame;

initGame();

