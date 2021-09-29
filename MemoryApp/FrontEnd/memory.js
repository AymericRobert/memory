const cards = document.querySelectorAll(".memory-card");

// On declare nos variables par default :
let hasFlippedCard = false; // bool qui indique si la carte est tournée
let lockBoard = false; // bool pour bloqué le retournement de carte
let firstCard, secondCard;
let correct_flips = 0; // nombre de doublons trouvé
let seconds = 0; // donnée utilisé pour nos fonctions de compteurs
let minutes = 0; // donnée utilisé pour nos fonctions de compteurs
let seconds_str = ""; // donnée utilisé pour nos fonctions de compteurs
let minutes_str = ""; // donnée utilisé pour nos fonctions de compteurs
let timer_observer; // donnée utilisé pour nos fonctions de compteurs
var t = 0; // donnée utilisé pour nos fonctions de compteurs

const time = document.querySelector(".time");

// FONCTION POUR RETOUNER LA CARTE
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flip");

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        return;
    }

    secondCard = this;
    checkForMatch();
    if (correct_flips >= 6) {
        endGame();
    }
}

// FONCTION POUR CHECKER DEUX CARTES IDENTIQUES
function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    if (isMatch) {
        disableCards();
        correct_flips += 1;
    } else {
        unflipCards();
    }
}

// FONCTION POUR BLOQUER LE "FLIP"
function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}
// FONCTIONS POUR TOURNER LA CARTE FACE CACHEE
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");

        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

//FONCTIONS POUR MELANGER LES CARTES: ON UTLISE la fonction javascript Math.random * le nb de carte
(function shuffle() {
    cards.forEach((card) => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

// LE COMPTEUR TEMPS DU JOUEUR ,  qui sera envoyé sur la base de donnée
function playerTime(seconds, minutes) {
    timer_observer = setInterval(() => {
        seconds > 58 ? ((minutes += 1), (seconds = 0)) : (seconds += 1);
        seconds_str = seconds > 9 ? `${seconds}` : `0${seconds}`;
        minutes_str = minutes > 9 ? `${minutes}` : `0${minutes}`;
        time.innerHTML = `${minutes_str}:${seconds_str}`;
    }, 1000);
}

// COMPTEUR DU TEMPS DE LA PARTIE
function countDown(reset) {
    var temp = window.t;
    window.t = window.t - 1;
    var m = Math.floor((temp % 3600) / 60);
    var s = Math.floor(temp - m * 60);
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById("countdown").innerHTML = `${s} sec`;
    document.getElementById("progress-bar").style.width =
        (temp * 100) / window.per + "%";

    var t = setTimeout(countDown, 1000);
    if (temp < 0 || reset) {
        lockBoard = true;
        cards.forEach((card) => card.classList.remove("flip"));
        (function shuffle() {
            cards.forEach((card) => {
                let randomPos = Math.floor(Math.random() * 12);
                card.style.order = randomPos;
            });
        })();
        clearInterval(timer_observer);
        clearInterval(t);
        correct_flips = 0;
        seconds = 0;
        minutes = 0;
        seconds_str = "";
        minutes_str = "";
        time.innerHTML = "XX:XX";
        t = 0;
        document.getElementById("startGame").disabled = false;
    }
}

// FONCTION DECLANCHE PAR LE BUTTON START, elle reset les données et start les compteurs
function startGame() {
    lockBoard = false;
    cards.forEach((card) => card.addEventListener("click", flipCard));
    correct_flips = 0;
    seconds = 0;
    minutes = 0;
    seconds_str = "";
    minutes_str = "";
    t = 0;
    time.innerHTML = "XX:XX";
    /////////////
    min = 0.6;
    window.t = min * 60;
    window.per = window.t;
    countDown();
    playerTime(seconds, minutes);
    document.getElementById("startGame").disabled = true;
    document.getElementById("loosemessage").innerHTML = " ";
}

// FONCTIONS DE FIN DE PARTIE : elle envoie le post pour le score, et reset le "board"
function endGame() {
    setTimeout(() => {
        alert("You WIN !");
    }, 500);
    $(document).ready(function () {
        var name = "SALUT";
        var score = time.innerHTML;
        $.ajax({
            url: "./../backEnd/post.php",
            method: "POST",
            data: {
                name: name,
                score: score,
            },
            success: function (data) {
                alert(data);
            },
        });
    });

    setTimeout(() => {
        cards.forEach((card) => card.classList.remove("flip"));
        (function shuffle() {
            cards.forEach((card) => {
                let randomPos = Math.floor(Math.random() * 12);
                card.style.order = randomPos;
            });
        })();
        document.getElementById("startGame").disabled = false;
    }, 500);
    clearInterval(timer_observer);
    clearInterval(t);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("leaderBoard").innerHTML =
                xmlhttp.responseText;
        }
    };
    xmlhttp.open(
        "GET",
        "./../backEnd/get.php?str=" +
            document.getElementById("leaderBoard").value,
        true
    );
    xmlhttp.send();
    countDown(true);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
