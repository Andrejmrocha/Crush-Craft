function startGame() {
    var playerName = document.getElementById('playerName').value;

    var container = document.getElementsByTagName('main')[0];
    container.parentNode.removeChild(container);
  
    var newDiv = document.createElement('div');
    newDiv.id = 'gameContainer';
    document.body.appendChild(newDiv);
  
    var scriptElement = document.createElement('script');
    scriptElement.src = 'fase_1_rascunho.js';
    scriptElement.setAttribute('data-player-name', playerName)
    document.body.appendChild(scriptElement);
}

function scores(){
  fetch('ranking.html')
  .then(response => response.text())
  .then(html => {
    document.getElementsByTagName('main')[0].innerHTML = html;
  })
  .catch(error => console.log(error));
}

function goHome(){
  document.getElementsByTagName('main')[0].innerHTML = `
  <h1>Crush Craft</h1>
  <input type="text" id="playerName" placeholder="Nome">
  <button id="startButton" onclick="startGame()">Iniciar jogo</button>
  <button id="scoresButton" onclick="scores()" >Pontuação</button>
  `;
}