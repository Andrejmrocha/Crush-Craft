import { Scene } from "phaser";


export default class Creditos extends Scene {
    constructor() {
        super('Creditos')
    }

    preload() {
        this.load.setPath('assets')
        this.load.image('github', 'github.png');
    }

    create() {
        const { width, height } = this.sys.game.config;


        this.creditos = this.add.text(width / 2, 80, 'Créditos', {
            fontSize: '32px',
            fill: '#FFF',
            fontFamily: 'Helvetica',
            padding: { x: 16, y: 10 }
        }).setOrigin(0.5);

        this.textoAutor = this.add.text(width / 2, 250, 'Projeto desenvolvido por André Rocha', {
            fontSize: '22px',
            fill: '#FFF',
            fontFamily: 'Helvetica',
            padding: { x: 16, y: 10 }
        }).setOrigin(0.5, 0.5);

        this.textoSupervisao = this.add.text(width / 2, 300, 'Supervisionado por Marcelo Bezerra', {
            fontSize: '18px',
            fill: '#FFF',
            fontFamily: 'Helvetica',
            padding: { x: 16, y: 10 }
        }).setOrigin(0.5, 0.5);

        this.logo = this.add.image(width / 2, 400, 'github').setOrigin(0.5, 0.5)
        this.logo.setInteractive({ useHandCursor: true });
        this.logo.on('pointerdown', () => {
            window.open('https://github.com/Andrejmrocha/Crushed-Craft','_blank')

        });
        this.botaoMenu = this.add.text(width / 2, 500, 'Menu', { 
            fontSize: '24px', 
            fill: '#FFF', 
            backgroundColor: '#2d2d2d', 
            fontFamily: 'Helvetica',
            padding: {x: 16, y: 10}
        }).setOrigin(0.5, 0.5);
        
        this.botaoMenu.setInteractive({ useHandCursor: true });
        this.botaoMenu.on('pointerdown', () => {
           
            this.scene.start('MainMenu')

        });

        this.botaoMenu.on('pointerover', () => {
            this.botaoMenu.setBackgroundColor('#8d8d8d');
        });

        this.botaoMenu.on('pointerout', () => {
            this.botaoMenu.setBackgroundColor('#2d2d2d');
        });

    }


}