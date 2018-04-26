(function () {
  'use strict';

  /*
   * Create a list that holds all of your cards
   */

  // icons for cards
  const icons = [
    'fa fa-diamond',
    'fa fa-paper-plane-o',
    'fa fa-anchor',
    'fa fa-bolt',
    'fa fa-cube',
    'fa fa-leaf',
    'fa fa-bicycle',
    'fa fa-bomb',
  ];

  // generate cards depends on icons above
  const cardsGenerator = function (numOfMatch = 8) {
    const cards = [];
    for (let i = 0; i < numOfMatch; i++) {
      const newCard = document.createElement('li');
      newCard.className = 'card animated flipInX';
      const icon = document.createElement('i');
      icon.className = icons[i];
      newCard.appendChild(icon);
      cards.push(newCard);
    }
    return cards;
  };


  /*
   * Display the cards on the page
   *   - shuffle the list of cards using the provided "shuffle" method below
   *   - loop through each card and create its HTML
   *   - add each card's HTML to the page
   */

// Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  // shuffle twice so the total cards should be 16 then render the cards
  const deck = document.getElementById('card-list');
  const renderCards = function () {
    for (let i = 0; i < 2; i++) {
      shuffle(cardsGenerator()).forEach(function (card) {
        deck.appendChild(card);
      });
    }
  };

  renderCards();

  /*
   * set up the event listener for a card. If a card is clicked:
   *  - display the card's symbol (put this functionality in another function that you call from this one)
   *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
   *  - if the list already has another card, check to see if the two cards match
   *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
   *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
   *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
   *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
   */

  const counterElement = document.getElementById('counter');
  const rates = document.getElementsByClassName('fa-star');
  const resetElement = document.getElementById('reset');
  const timerElement = document.getElementById('timer');
  let cardsElements = document.querySelectorAll('.card');
  let openedCards = [];
  let matchedCards = 0;
  let someCardOpened = false;
  let timer = 1;
  let startTimer;

  // reset the game
  resetElement.addEventListener('click', function (event) {
    restartGame();
  });

  const restartGame = function () {
    matchedCards = 0;
    openedCards = [];
    counterElement.innerText = '0';
    // remove all the child nodes
    while (deck.hasChildNodes()) {
      deck.removeChild(deck.lastChild);
    }
    // reset everything
    timer = 0;
    clearInterval(startTimer);
    timerElement.innerText = '0';
    someCardOpened = false;
    // reset the stars
    const rateStars = document.querySelectorAll('.fa-star-o');
    if (rateStars.length > 0) {
      rateStars.forEach(function (r) {
        r.className = 'fa fa-star';
      });
    }
    renderCards();
    cardsElements = document.querySelectorAll('.card');
    runCardListener();
  };

  const showIcon = function (node) {
    node.className = 'card open show';
  };

  const openCard = function (node) {
    openedCards.push(node);
  };

  const match = function () {
    openedCards.forEach(function (card) {
      card.className = 'card match animated tada';
    });
    setTimeout(function () {
      openedCards = [];
    }, 1200);
  };

  const notmath = function () {
    openedCards.forEach(function (card) {
      card.className = 'card nomatch animated shake';
      setTimeout(function () {
        card.className = 'card';
        openedCards = [];
        cardListener(card);
      }, 1200);
    });
  };

  // check if the two cards match
  const checkCard = function () {
    if (openedCards.length === 2) {
      countMoves();
      if (openedCards[0].childNodes[0].className === openedCards[1].childNodes[0].className) {
        match();
        matchedCards++;
      } else {
        notmath();
      }
    }
  };

  const countMoves = function () {
    counterElement.innerText++;
    switch (Number(counterElement.innerText)) {
      case 20:
        rates[2].className = 'fa fa-star-o';
        break;
      case 25:
        rates[1].className = 'fa fa-star-o';
        break;
      default:
    }
  };

  const finalCheck = function () {
    if (matchedCards === 8) {
      clearInterval(startTimer);
      setTimeout(function () {
        const result = confirm(`
          Your final score is : ${(matchedCards * 1000 / counterElement.innerText).toFixed(2)}
          Your rate is : ${rates.length} stars
          You won the game in : ${timer} sec
          Play again ?
        `);
        if (result) {
          restartGame();
        } else {
          return;
        }
      }, 1000);
    }
  };

  const cardListener = function (card) {
    card.addEventListener('click', function (event) {
      // if openedCards is equal to 2 then stop opening cards until it finish from checking cards match.
      if (openedCards.length === 2) {
        return cardListener(card);
      }
      if (!someCardOpened) {
        someCardOpened = !someCardOpened;
        startTimer = setInterval(function () {
          timerElement.innerText = `${timer++} sec`;
        }, 1000);
      }
      showIcon(this);
      openCard(this);
      checkCard(this);
      finalCheck();
    }, {once: true});
  };

  const runCardListener = function () {
    cardsElements.forEach(function (card) {
      cardListener(card);
    });
  };
  runCardListener();

})();