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

    const startGameButton = this.add.text(width / 2, 400, 'Iniciar Jogo', { 
      fontSize: '24px', 
      fill: '#FFF', 
      backgroundColor: '#2d2d2d', 
      fontFamily: 'Helvetica',
      padding: {x:58, y:10},
    }).setOrigin(0.5);
    startGameButton.setInteractive({ useHandCursor: true });
    startGameButton.on('pointerdown', () => {
      this.scene.start('Stage1')
      

    });

    startGameButton.on('pointerover', () => {
      startGameButton.setBackgroundColor('#8d8d8d');
    });

    startGameButton.on('pointerout', () => {
      startGameButton.setBackgroundColor('#2d2d2d');
    });

    const rankingButton = this.add.text(width / 2, 450, 'Maiores Pontuações', { 
      fontSize: '24px', 
      fill: '#FFF', 
      backgroundColor: '#2d2d2d', 
      fontFamily: 'Helvetica',
      padding: {x:10, y:10},
    }).setOrigin(0.5);
    rankingButton.setInteractive({ useHandCursor: true });
    rankingButton.on('pointerdown', function () {
      // score = 0;
      rankingButton.destroy();

    });

    rankingButton.on('pointerover', () => {
      rankingButton.setBackgroundColor('#8d8d8d');
    });

    rankingButton.on('pointerout', () => {
      rankingButton.setBackgroundColor('#2d2d2d');
    });

  }

}
