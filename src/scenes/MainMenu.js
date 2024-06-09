import Phaser from "phaser";

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenu" });
  }

  preload() {
    this.load.setPath('assets')
    this.load.image('background', 'home.png')
  }

  create() {
    const { width, height } = this.sys.game.config;
    this.add.image(width / 2, height / 2, 'background')

    const input = this.add.dom(width / 2, 323, 'input', 'width: 13.5em; height: 6.5vh; padding: 0 10px; font-size:1em', '')
    const placeholder = this.add.dom(width / 2, (height / 2)+2, 'p', 'width: 16em; height: 1vh; margin-left: 1.5em; color:gray', 'Digite seu nome...')

    placeholder.node.addEventListener('click', () => {
      input.node.focus()
    })

    input.node.addEventListener('focus', () => {
      placeholder.setVisible(false)
    })

    input.node.addEventListener('blur', () => {
      if (input.node.value === '') {
        placeholder.setVisible(true)
      }
    })

    const startGameButton = this.add.text(width / 2, 387, 'Iniciar Jogo', { 
      fontSize: '24px', 
      fill: '#FFF', 
      backgroundColor: '#2d2d2d', 
      fontFamily: 'Helvetica',
      padding: {x:58, y:10},
    }).setOrigin(0.5);
    startGameButton.setInteractive({ useHandCursor: true });
    startGameButton.on('pointerdown', () => {
      if(input.node.value.trim() === '') alert('Inserir um nome')
      else {
        this.registry.set('playerName', input.node.value)
        this.scene.start('Fase1')
      }
      
      

    });

    startGameButton.on('pointerover', () => {
      startGameButton.setBackgroundColor('#8d8d8d');
    });

    startGameButton.on('pointerout', () => {
      startGameButton.setBackgroundColor('#2d2d2d');
    });

    const rankingButton = this.add.text(width / 2, 435, 'Maiores Pontuações', { 
      fontSize: '24px', 
      fill: '#FFF', 
      backgroundColor: '#2d2d2d', 
      fontFamily: 'Helvetica',
      padding: {x:10, y:10},
    }).setOrigin(0.5);
    rankingButton.setInteractive({ useHandCursor: true });
    rankingButton.on('pointerdown', () => {
      this.scene.start('Ranking')
      

    });

    rankingButton.on('pointerover', () => {
      rankingButton.setBackgroundColor('#8d8d8d');
    });

    rankingButton.on('pointerout', () => {
      rankingButton.setBackgroundColor('#2d2d2d');
    });

    const tutorialButton = this.add.text(width / 2, 483, 'Tutorial', { 
      fontSize: '24px', 
      fill: '#FFF', 
      backgroundColor: '#2d2d2d', 
      fontFamily: 'Helvetica',
      padding: {x:79.5, y:10},
    }).setOrigin(0.5);
    tutorialButton.setInteractive({ useHandCursor: true });
    tutorialButton.on('pointerdown', () => {
      // score = 0;
      this.scene.start('Tutorial')

    });

    tutorialButton.on('pointerover', () => {
      tutorialButton.setBackgroundColor('#8d8d8d');
    });

    tutorialButton.on('pointerout', () => {
      tutorialButton.setBackgroundColor('#2d2d2d');
    });

    const creditosButton = this.add.text(width / 2, 531, 'Créditos', { 
      fontSize: '24px', 
      fill: '#FFF', 
      backgroundColor: '#2d2d2d', 
      fontFamily: 'Helvetica',
      padding: {x:74.5, y:10},
    }).setOrigin(0.5);
    creditosButton.setInteractive({ useHandCursor: true });
    creditosButton.on('pointerdown', () => {
      this.scene.start('Creditos')

    });

    creditosButton.on('pointerover', () => {
      creditosButton.setBackgroundColor('#8d8d8d');
    });

    creditosButton.on('pointerout', () => {
      creditosButton.setBackgroundColor('#2d2d2d');
    });

  }

}
