import { Scene } from "phaser";


export default class Tutorial extends Scene {
    constructor() {
        super('Tutorial')
    }

    preload() {
        this.load.setPath('assets')
        this.load.image('setaEsquerda', 'seta_esquerda.png');
        this.load.image('setaDireita', 'seta_direita.png');
        this.load.image('shift', 'shift.png');

        this.load.image('barra', 'barra_m.png');
        this.load.image('bola', 'ball.png');
        this.load.image('bloco4', 'bloco_4.png')
        this.load.image('bloco2', 'bloco_2.png')
    }

    create() {
        const { width, height } = this.sys.game.config;
        

        this.jogabilidade = this.add.text(width / 2, 80, 'Jogabilidade', {
            fontSize: '32px',
            fill: '#FFF',
            fontFamily: 'Helvetica',
            padding: { x: 16, y: 10 }
        }).setOrigin(0.5);

        this.bloco = this.add.image(80, 140, 'bloco2').setScale(0.7)
        this.bloco2 = this.add.image(120, 140, 'bloco4').setScale(0.7)
        this.textoBloco = this.add.text(140, 125, 'O objetivo do jogo é destruir todos os blocos', {
            fontSize: '12px',
            fill: '#FFF',
            fontFamily: 'Helvetica',
            padding: { x: 16, y: 10 }
        });

        this.bola = this.add.image(100, 190, 'bola').setScale(0.7)
        this.textoBola = this.add.text(140, 175, 'Destrói o bloco ao entrar em contato', {
            fontSize: '12px',
            fill: '#FFF',
            fontFamily: 'Helvetica',
            padding: { x: 16, y: 10 }
        });

        this.barra = this.add.image(100, 240, 'barra').setScale(0.7)
        this.textoBarra = this.add.text(140, 225, 'Utilizada para rebater a bola em direção aos blocos', {
            fontSize: '12px',
            fill: '#FFF',
            fontFamily: 'Helvetica',
            padding: { x: 16, y: 10 }
        });

        this.controles = this.add.text(width / 2, 340, 'Controles', {
            fontSize: '32px',
            fill: '#FFF',
            fontFamily: 'Helvetica',
            padding: { x: 16, y: 10 }
        }).setOrigin(0.5);

        this.setaEsquerda = this.add.image(80, 405, 'setaEsquerda');
        this.setaDireita = this.add.image(120, 405, 'setaDireita');
        this.shift = this.add.image(100, 455, 'shift');

        this.textoSetas = this.add.text(140, 388, 'As teclas de seta esquerda e seta direita controlam o movimento da barra', {
            fontSize: '12px',
            fill: '#FFF',
            fontFamily: 'Helvetica',
            padding: { x: 16, y: 10 }
        });

        this.textoShift = this.add.text(140, 438, 'Pressione shift para aumentar sua velocidade de movimento', {
            fontSize: '12px',
            fill: '#FFF',
            fontFamily: 'Helvetica',
            padding: { x: 16, y: 10 }
        });

        this.botaoMenu = this.add.text(width / 2, 510, 'Menu', { 
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