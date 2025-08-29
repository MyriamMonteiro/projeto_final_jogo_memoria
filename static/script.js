const memoryGame = document.getElementById('memory-game');
const movesCountElement = document.getElementById('moves-count');
const restartButton = document.getElementById('restart-button');

let cardsArray = [];
const numPairs = 8;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchesFound = 0;
let moves = 0;

const cardImages = [
    '../static/assets/img/bolo1.0.png',
    '../static/assets/img/milho1.0.png',
    '../static/assets/img/pipoca1.0.png',
    '../static/assets/img/canjica1.0.png',
    '../static/assets/img/pizza1.0.png',
    '../static/assets/img/quentao1.0.png',
    '../static/assets/img/chocolate1.0.png',
    '../static/assets/img/batata-doce1.0.png',
];

/* função - inicia o jogo */
function initializeGame() {
    cardsArray = [];
    matchesFound = 0;
    moves = 0;
    movesCountElement.textContent = moves;
    memoryGame.innerHTML = '';

    for (let i = 0; i < numPairs; i++) {
        cardsArray.push({ id: i, image: cardImages[i] });
        cardsArray.push({ id: i, image: cardImages[i] });
    }    

    shuffleCards(cardsArray);

    cardsArray.forEach(card => {
        const memoryCard = document.createElement('div');
        memoryCard.classList.add('memory-card');
        memoryCard.dataset.id = card.id;

        const frontFace = document.createElement('img');
        frontFace.classList.add('front-face');
        frontFace.src = card.image;
        frontFace.alt = 'Card Front';

        const backFace = document.createElement('img');
        backFace.classList.add('back-face');
        backFace.src = '../static/assets/img/cerebro.png';
        backFace.alt = 'Card Back';

        memoryCard.appendChild(frontFace);
        memoryCard.appendChild(backFace);

        memoryCard.addEventListener('click', flipCard);
        memoryGame.appendChild(memoryCard);
    });
}

/* embaralha as cartas e deixa em ordem aleatória */
function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesCountElement.textContent = moves;

    checkForMatch();
}

/* Verica se as cartas são iguais */
function checkForMatch() {
    let isMatch = firstCard.dataset.id === secondCard.dataset.id;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

/* desabilita as cartas que viraram par */
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    firstCard.classList.add('match');
    secondCard.classList.add('match');

    matchesFound++;

    if (matchesFound === numPairs) {
        setTimeout(() => {
            alert(`Parabéns! Você encontrou todos os pares em ${moves} movimentos!`);

            /*quando termina o jogo. Js envia para o python - flask */
            fetch("/historico_resultado", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({resultado: moves})
            })
            .then(res => res.json())
            .then(data => {
                console.log(data.mensagem);
                document.getElementById("ultimo-resultado").textContent = moves;
            });

        }, 500);
    }

    resetBoard();
}

/* Se as cartas são diferentes, voltam para a posição */
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

restartButton.addEventListener('click', initializeGame);

initializeGame();
