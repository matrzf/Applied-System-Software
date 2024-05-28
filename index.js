document.addEventListener('DOMContentLoaded', function() {
  const playerSelect = document.getElementById('playerSelect');
  const usernameInputs = document.querySelectorAll('#select-usernames input');
  const startButton = document.getElementById('startButton');
  const gameParameters = document.getElementById('gameParameters');
  const gamePage = document.getElementById('gamePage');
  const endGamePage = document.getElementById('endGamePage');

  const tableDiv = document.getElementById('table');
  const tableDiv2 = document.getElementById('table2');
  const stockingTable = document.getElementById('stockingTable');

  const wheel = document.querySelector('.wheel');
  const spinBtn = document.querySelector('.spinBtn');
  const valuePickedDiv = document.getElementById('valuePicked');

  const sentenceContainer = document.getElementById('sentence-container');
  const message = document.getElementById('message');
  const playerTurnDisplay = document.getElementById('player-turn');
  const guessInput = document.getElementById('guess-input');
  const guessButton = document.getElementById('guess-button');
  const guessSentenceButton = document.getElementById('guess-sentence-button');
  const guessSentenceInput = document.getElementById('guess-sentence-input');
  const buyVowelButton = document.getElementById("buy-vowel-button");
  const buyVowelInput = document.getElementById("buy-vowel-input");
  const skipTurnButton = document.getElementById("skip-turn-button");
  const endGameButton = document.getElementById('endGameButton');

  const winnerText = document.getElementById("winnerText");
  const newGameButton = document.getElementById('newGameButton');

  let value = Math.ceil(Math.random() * 3600);
  let currentPlayerIndex = 0; // To keep track of the current player
  let roundScores = []; // Array to store round scores for each player
  let totalScores = [];
  let selectedValue = ''; // Store the value selected by spinning the wheel
  let hasSpun = false; // To check if the player has spun the wheel
  let usernames = []; // Array to store usernames
  let roundUsedLetters = [];

  let sentences = [
    "Hello world",
    "Hola a todos",
    "Bonjour le monde"
  ];
  let randomSentence = Math.floor(Math.random() * sentences.length);
  let sentence = sentences[randomSentence];
  sentences = sentences.filter(value => value !== sentence);
  console.log(sentences);
  let displayedSentence = "";
  for (let i = 0; i < sentence.length; i++) {
    if (sentence[i] === ' ') {
        displayedSentence += ' ';
    } else {  
        displayedSentence += '_';
    }
  }
  console.log(displayedSentence);

  const selectedPlayers = parseInt(playerSelect.value);
  usernameInputs.forEach((input, index) => {
    if (index < selectedPlayers) {
      input.style.display = 'block';
    } else {
      input.style.display = 'none';
    }
  });

  playerSelect.addEventListener('change', function() {
    const selectedPlayers = parseInt(playerSelect.value);
    usernameInputs.forEach((input, index) => {
      if (index < selectedPlayers) {
        input.style.display = 'block';
      } else {
        input.style.display = 'none';
      }
    });
  });

  function createTable() {
    // Clear previous content of the table div
    tableDiv.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = table.insertRow();
    const headers = ['Username', 'Round', 'Total'];

    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    usernames = []; // Reset usernames

    for (let i = 0; i < parseInt(playerSelect.value); i++) {
      const row = table.insertRow();
      const username = usernameInputs[i].value.trim() || `Player ${i + 1}`; // Use default username if input is empty
      usernames.push(username); // Store the username

      if(hasDuplicates(usernames)){
        usernames = [];
        return true;
      }

      for (let j = 0; j < 3; j++) {
        const cell = row.insertCell();
        if (j === 0) {
          cell.textContent = username;
        } else {
          cell.textContent = ''; // Leave other cells empty initially
        }
      }
    }

    tableDiv.appendChild(table);
  }

  function updateTable(playerIndex, score) {
    const table = tableDiv.querySelector('table');
    const row = table.rows[playerIndex + 1]; // +1 to skip header row
    const roundCell = row.cells[1];
    let currentRoundScore = parseInt(roundCell.textContent) || 0;

    if (score === "Bankrupt") {
      currentRoundScore = 0; // Reset round score to 0 if Bankrupt
    } else if (score !== "Lose a turn" && score !== "Free Play") {
      currentRoundScore += parseInt(score); // Add score if not Bankrupt, Lose a turn, or Free Play
    }

    roundCell.textContent = currentRoundScore;
  }

  function hasDuplicates(array) {
    const uniqueValues = new Set(array);
    return uniqueValues.size !== array.length;
  }

  function displayLetters(letters) {
    // Get the div element by its ID
    const lettersDiv = document.getElementById('lettersDiv');
    // Clear any previous content in the div
    lettersDiv.innerHTML = '';
  
    // Join the letters into a single string
    const lettersString = letters.join(', ');
  
    // Set the string as the text content of the div
    lettersDiv.textContent = lettersString;
  }

  function updateDisplayedSentence() {
    sentenceContainer.textContent = displayedSentence.split('').map((char, index) => {
      return sentence[index] === ' ' ? ' ' : char;
    }).join('');
  }

  function switchPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % roundScores.length;
    playerTurnDisplay.textContent = `${usernames[currentPlayerIndex]}'s Turn`;
    hasSpun = false;
  }

  function newRound(){
    totalScores[currentPlayerIndex] += roundScores[currentPlayerIndex];

    const table = tableDiv.querySelector('table');
    table.rows[currentPlayerIndex + 1].cells[2].textContent = totalScores[currentPlayerIndex];
  
    if (!table) {
      return; // Exit if no table is found
    }

    // Iterate through each row, starting from the second row (index 1)
    for (let i = 1; i < table.rows.length; i++) {
      const roundCell = table.rows[i].cells[1]; // The "Round" column is the second column (index 1)
      roundCell.textContent = '0'; // Set the cell's text content to 0
    }

    roundScores = new Array(selectedPlayers).fill(0);

    console.log(totalScores);
    console.log(roundScores);

    roundUsedLetters = [];
    displayLetters(roundUsedLetters);
    randomSentence = Math.floor(Math.random() * sentences.length);
    sentence = sentences[randomSentence];

    displayedSentence = "";
    for (let i = 0; i < sentence.length; i++) {
      if (sentence[i] === ' ') {
          displayedSentence += ' ';
      } else {  
          displayedSentence += '_';
      }
    }
    console.log(displayedSentence);
    updateDisplayedSentence();
    sentences = sentences.filter(value => value !== sentence);
    console.log(sentences);

    if(totalScores[currentPlayerIndex]>10000){
      endGame();
    }
  }

  function isVowelOrConsonant(letter) {
    // Normalize the input to lowercase
    const lowerCaseLetter = letter.toLowerCase();

    // Define the vowels
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];

    // Check if the input is a single alphabetic character
    if (lowerCaseLetter.length !== 1 || !/[a-z]/.test(lowerCaseLetter)) {
        return "Input is not a valid letter.";
    }

    // Check if the letter is a vowel
    if (vowels.includes(lowerCaseLetter)) {
        return true;
    } else {
        return false;
    }

  }

  function endGame(){
    gamePage.style.display = 'none';
    endGamePage.style.display = 'flex';
    //choseTable = tableDiv2;
    //createTable(tableDiv2);
    let maxValue = Math.max(...totalScores);
    let index = totalScores.indexOf(maxValue);
    winnerText.textContent = `${usernames[index]} won the game!`
    tableDiv2.appendChild(tableDiv);

  }

  function newGame(){
    let sentences = [
      "Hello world",
      "Hola a todos",
      "Bonjour le monde"
    ];
    sentenceContainer.textContent = '';
    randomSentence = Math.floor(Math.random() * sentences.length);
    sentence = sentences[randomSentence];
    displayedSentence = "";
    for (let i = 0; i < sentence.length; i++) {
      if (sentence[i] === ' ') {
          displayedSentence += ' ';
      } else {  
          displayedSentence += '_';
      }
    }
    console.log(displayedSentence);
    sentences = sentences.filter(value => value !== sentence);
    console.log(sentences);
    hasSpun = false;
    message.textContent = '';
    roundUsedLetters = [];
    displayLetters(roundUsedLetters);
    totalScores = new Array(selectedPlayers).fill(0);
    stockingTable.appendChild(tableDiv);
    tableDiv.innerHTML = '';

    endGamePage.style.display = 'none';
    gameParameters.style.display = 'flex';
  }

  spinBtn.onclick = function() {
    if (hasSpun) {
      message.textContent = "You've already spun. Guess a letter!";
      return;
    }

    hasSpun = true;
    // Spin the wheel
    let spinValue = Math.ceil(Math.random() * 3600);
    wheel.style.transform = `rotate(${value + spinValue}deg)`;

    // Update value
    value += spinValue;

    // Calculate the current rotation
    let currentRotation = (value % 360 + 360) % 360; // Ensure positive rotation

    // Calculate the position of the arrow on the wheel
    let arrowPosition = 360 - currentRotation; // Reverse rotation for easier calculations

    // Update segmentCount to reflect the new number of sections
    let segmentCount = 23; // Number of segments on the wheel

    // Calculate the angle span of each segment
    let segmentAngle = 360 / segmentCount;

    // Calculate the segment number and shift by -2 positions to the left
    let segmentNumber = Math.floor((arrowPosition + (segmentAngle / 2)) / segmentAngle) + 2;

    // Ensure the segmentNumber is within bounds
    segmentNumber = (segmentNumber + segmentCount) % segmentCount;

    // Use setTimeout to delay the selected value display
    setTimeout(() => {
      // Get the selected value
      selectedValue = document.querySelector(`.number:nth-child(${segmentNumber + 1}) span`).textContent;

      console.log("Value selected: " + selectedValue);

      valuePickedDiv.textContent = `Selected Value: ${selectedValue}`;
      hasSpun = true;

      if (selectedValue === "Bankrupt"){
        roundScores[currentPlayerIndex]=0;
        const table = tableDiv.querySelector('table');
        table.rows[currentPlayerIndex + 1].cells[1].textContent = roundScores[currentPlayerIndex];
        hasSpun = false;
        switchPlayer();
      } else if(selectedValue === "Lose a turn" || selectedValue === "Free Play"){
        hasSpun = false;
        switchPlayer();      
      }

    }, 5000); // Match this duration to the CSS transition duration

  }

  guessButton.addEventListener('click', () => {
    if (!hasSpun) {
      message.textContent = 'Please spin the wheel first.';
      return;
    }
    
    const guess = guessInput.value.toLowerCase();
    guessInput.value = '';

    if (guess.length !== 1 || !guess.match(/[a-z]/i)) {
      message.textContent = 'Please enter a valid letter.';
      return;
    }

    if (isVowelOrConsonant(guess)===true) {
      message.textContent = 'Please enter consonant or buy a vowel.';
      return;
    }

    if (roundUsedLetters.includes(guess)){
      message.textContent = 'This letter was already used.';
      return;
    } else {
      //roundUsedLetters += guess.toLowerCase();
      roundUsedLetters.push(guess.toLowerCase());
    }

    message.textContent = '';

    if (sentence.toLowerCase().includes(guess)) {
      let newDisplayedSentence = '';
      for (let i = 0; i < sentence.length; i++) {
        if (sentence[i].toLowerCase() === guess) {
          newDisplayedSentence += sentence[i];
        } else {
          newDisplayedSentence += displayedSentence[i];
        }
      }
      displayedSentence = newDisplayedSentence;
      updateDisplayedSentence();

      if (!displayedSentence.includes('_')) {
        message.textContent = `${usernames[currentPlayerIndex]} wins!`;
        guessButton.disabled = true;
        spinBtn.disabled = true;
      }

      if (selectedValue !== "Bankrupt" && selectedValue !== "Lose a turn" && selectedValue !== "Free Play") {
      updateTable(currentPlayerIndex, selectedValue);
      roundScores[currentPlayerIndex] += parseInt(selectedValue);
      }
    } else {
      switchPlayer();
    }
    console.log(roundScores);
    displayLetters(roundUsedLetters);
    console.log(roundUsedLetters);
    hasSpun = false;
  });

  guessSentenceButton.addEventListener('click', ()=>{

    if (hasSpun) {
      message.textContent = 'You spun the wheel so you cannot guess the sentence. You have to chose a letter.';
      return;
    }

    let guess = guessSentenceInput.value.toLowerCase();
    guessSentenceInput.value = '';

    if (guess.length === "" || !guess.match(/[a-z]/i)) {
      message.textContent = 'Please enter a valid sentence.';
      return;
    }

    message.textContent = '';

    if(guess === sentence.toLowerCase()){
      console.log("guessed");
      message.textContent = `${usernames[currentPlayerIndex]} won the round!`;
      newRound();
    } else {
      const table = tableDiv.querySelector('table');
      roundScores[currentPlayerIndex] = 0;
      table.rows[currentPlayerIndex + 1].cells[1].textContent = roundScores[currentPlayerIndex];
      switchPlayer();
    }

  });

  buyVowelButton.addEventListener('click', function() {

    if (hasSpun) {
      message.textContent = 'You spun the wheel so you cannot buy a vowel. You have to chose a letter.';
      return;
    }

    let guess = buyVowelInput.value.toLowerCase();
    buyVowelInput.value = '';

    if (guess.length !== 1 || !guess.match(/[a-z]/i)) {
      message.textContent = 'Please enter a vowel.';
      console.log("test");
      return;
    }

    if (!isVowelOrConsonant(guess)) {
      message.textContent = 'Please enter a vowel.';
      console.log("test2");
      return;
    }

    if (roundUsedLetters.includes(guess)){
      message.textContent = 'This vowel was already used.';
      return;
    } 

    roundScores[currentPlayerIndex] -= 500;
    if(roundScores[currentPlayerIndex]<0){
      message.textContent = 'You do not have enough money';
      roundScores[currentPlayerIndex] += 500;
      console.log(roundScores);
      return;
    }

    message.textContent = '';

    //roundUsedLetters += guess.toLowerCase();
    roundUsedLetters.push(guess.toLowerCase());
    const table = tableDiv.querySelector('table');
    table.rows[currentPlayerIndex + 1].cells[1].textContent = roundScores[currentPlayerIndex];

    if (sentence.toLowerCase().includes(guess)) {
      let newDisplayedSentence = '';
      for (let i = 0; i < sentence.length; i++) {
        if (sentence[i].toLowerCase() === guess) {
          newDisplayedSentence += sentence[i];
        } else {
          newDisplayedSentence += displayedSentence[i];
        }
      }
      displayedSentence = newDisplayedSentence;
      updateDisplayedSentence();

      if (!displayedSentence.includes('_')) {
        message.textContent = `${usernames[currentPlayerIndex]} won the round!`;
        newRound();
      }
      //updateTable(currentPlayerIndex, selectedValue);
      //roundScores[currentPlayerIndex] += parseInt(selectedValue);
    } else {
      switchPlayer();
    }

    displayLetters(roundUsedLetters);

  });

  skipTurnButton.addEventListener('click', ()=>{
    hasSpun=false;
    switchPlayer();
  });

  endGameButton.addEventListener('click', function() {
    endGame()
  });

  newGameButton.addEventListener('click', function() {
    newGame()
  });

  startButton.addEventListener('click', function() {
    if(createTable()){
      return
    };

    gameParameters.style.display = 'none';
    gamePage.style.display = 'flex';
    

    // Initialize roundScores for all players
    const selectedPlayers = parseInt(playerSelect.value);
    roundScores = new Array(selectedPlayers).fill(0);
    totalScores = new Array(selectedPlayers).fill(0);

    updateDisplayedSentence();
    playerTurnDisplay.textContent = `${usernames[currentPlayerIndex]}'s Turn`;

  });

});


function redirect() {
  window.location.href = '../menugenial/menu.html';
}

      
