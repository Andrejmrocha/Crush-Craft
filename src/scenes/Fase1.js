import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, doc, updateDoc } from "firebase/firestore";

import { Scene } from "phaser";

var config = {
    apiKey: "AIzaSyDrUK2Xt1HZyUKT2rf5xywJMCsOWJHLz4Q",
    authDomain: "crushed-craft.firebaseapp.com",
    databaseURL: "https://crushed-craft-default-rtdb.firebaseio.com",
    projectId: "crushed-craft",
    storageBucket: "crushed-craft.appspot.com",
    messagingSenderId: "564586667510",
    appId: "1:564586667510:web:9dd28f5d3ed853c2023bd7",
    measurementId: "G-GG4CPNN526"
};

const app = initializeApp(config)
const analytics = getAnalytics(app)
const db = getFirestore(app)


export default class Fase1 extends Scene {
    constructor() {
        super('Fase1');
        this.totalColunas = 8;
        this.totalLinhas = 5;
        this.salvou = false

    }

    async addScore(name, score) {
        try {
            const save = await addDoc(collection(db, 'pontuacao'), { nome: name, pontos: score });
            this.registry.set('id_pontuacao_atual', save.id)
            this.salvou = true
        } catch (error) {
            console.error(error)
        }

    }

    preload() {
        this.load.setPath('assets')

        this.load.image('barra', 'barra_m.png');
        this.load.image('bola', 'ball.png');
        this.load.image('vida', 'life_full.png')
        this.load.image('vida_invert', 'life_full_invert.png')
        this.load.image('vida_vazia', 'life.png')
        this.load.image('vida_vazia_invert', 'life_invert.png')

        for (let bloco = 1; bloco < 10; bloco++) {
            this.load.image(`bloco_${bloco}`, `bloco_${bloco}.png`)

        }
    }

    create() {
        this.player = this.registry.get('playerName')
        const { width, height } = this.sys.game.config;
        this.jogoIniciou = false;
        this.start = false;
        this.restart = false;
        this.fimDeJogo = false;
        this.end = false;
        this.pontuacao = 0;
        this.vidas = 5;

        // criação da barra
        this.barra = this.physics.add.image(width / 2, 550, 'barra');
        this.barra.setImmovable(true);
        this.barra.setCollideWorldBounds(true);

        //criação da bolinha
        this.bola = this.physics.add.image(width / 2, 450, 'bola');
        this.bola.setCollideWorldBounds(true);
        this.bola.setBounce(1, 1);

        // criação de blocos
        this.blocos = [];
        for (let linha = 0; linha < this.totalLinhas; linha++) {
            var linhaBlocos = this.physics.add.staticGroup();

            for (let coluna = 0; coluna < this.totalColunas; coluna++) {
                const eh_coluna = coluna === 0 || coluna === 2 || coluna === 4 || coluna === 6;

                if (eh_coluna) {
                    linhaBlocos.create(120 + coluna * 60, 120 + linha * 60, 'bloco_' + this.gerarAleatorio(1, 9));
                }
            }

            this.blocos.push(linhaBlocos);
        }

        this.blocos.forEach((linha) => {
            linha.children.iterate((bloco) => {
                this.physics.add.collider(this.bola, bloco, function () {
                    this.atualizarScore(bloco)
                }, null, this);
            }, this);
        }, this);

        // Texto com animação para inicar o jogo
        this.textoInicio = this.add.text(width / 2, 500, 'Pressione Enter para iniciar', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Helvetica'
        }).setOrigin(0.5).setShadow(2, 2, '#2bfff0', 10, false, true);

        this.tweens.add({
            targets: this.textoInicio,
            alpha: 0,
            duration: 1200,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });

        this.cursor = this.input.keyboard.createCursorKeys();

        // Texto pontuação
        this.textoScore = this.add.text(24, 16, `Pontuação: 0`, {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Helvetica'
        });

        // Criação dos elementos de vida
        this.vidasGrupo = [];
        for (let i = 481, x = 1; i < 562; i += 20) {
            if (x % 2 != 0) {
                this.vidasGrupo.push(this.physics.add.image(i, 30, 'vida'))
            } else {
                this.vidasGrupo.push(this.physics.add.image(i, 30, 'vida_invert'))
            }

            x++;
        }
    }

    update() {
        const { width, height } = this.sys.game.config;

        document.addEventListener('keydown', (event) => {
            if (event.key === "Enter" && !this.jogoIniciou && !this.start) {
                this.jogoIniciou = true;
                this.start = true;
            }
        });

        if (this.jogoIniciou) {
            window.removeEventListener('keydown', this)
            this.textoInicio.destroy();
            this.bola.setVelocityX(Math.floor(Math.random() * 200) + 150);
            this.bola.setVelocityY(-300);
            this.jogoIniciou = false;
        }

        if (this.cursor.left.isDown) {
            if (this.cursor.shift.isDown) {
                this.barra.setVelocityX(-900)
            } else {
                this.barra.setVelocityX(-500)
            }
        }
        else if (this.cursor.right.isDown) {
            if (this.cursor.shift.isDown) {
                this.barra.setVelocityX(900)
            } else {
                this.barra.setVelocityX(500)
            }
        }
        else {
            this.barra.setVelocityX(0)
        }

        this.physics.collide(this.bola, this.barra);

        if (this.bola.y >= 590) {
            var ultimaVelocidade = this.bola.body.velocity.x
            this.vidas -= 1;
            this.bola.setX(width / 2);
            this.bola.setY(450);
            this.bola.setVelocityX(0)
            this.bola.setVelocityY(0)

            if (this.vidas > 0) {
                const textoRestarte = this.add.text(width / 2, 500, 'Pressione qualquer tecla para reiniciar', {
                    fontSize: '24px',
                    fill: '#fff',
                    fontFamily: 'Helvetica'
                }).setOrigin(0.5, 0.5).setShadow(2, 2, '#FFED00', 10, false, true);
                this.tweens.add({
                    targets: textoRestarte,
                    alpha: 0,
                    duration: 1200,
                    ease: 'Power2',
                    yoyo: true,
                    repeat: -1
                });
                this.input.keyboard.once('keydown', (event) => {
                    textoRestarte.destroy();

                    this.bola.setVelocityX(ultimaVelocidade);
                    this.bola.setVelocityY(-300);

                });
            }
        }

        if (this.vidas == 4) {
            this.vidasGrupo[4].destroy();
            this.vidasGrupo.push(this.physics.add.image(561, 30, 'vida_vazia'))
        } else if (this.vidas == 3) {
            this.vidasGrupo[3].destroy();
            this.vidasGrupo.push(this.physics.add.image(541, 30, 'vida_vazia_invert'))
        } else if (this.vidas == 2) {
            this.vidasGrupo[2].destroy();
            this.vidasGrupo.push(this.physics.add.image(521, 30, 'vida_vazia'))
        } else if (this.vidas == 1) {
            this.vidasGrupo[1].destroy();
            this.vidasGrupo.push(this.physics.add.image(501, 30, 'vida_vazia_invert'))
        } else if (this.vidas == 0) {
            this.vidasGrupo[0].destroy();
            this.vidasGrupo.push(this.physics.add.image(481, 30, 'vida_vazia'))
            this.sem_vidas()
            if (!this.restart) {
                this.botaoRestart = this.add.text(width / 2, 460, 'Reiniciar', {
                    fontSize: '24px',
                    fill: '#FFF',
                    backgroundColor: '#2d2d2d',
                    fontFamily: 'Helvetica',
                    padding: { x: 16, y: 10 }
                }).setOrigin(0.5, 0.5);
                this.botaoRestart.setInteractive({ useHandCursor: true });
                this.botaoRestart.on('pointerdown', () => {
                    this.pontuacao = 0;
                    this.salvou = false;
                    this.scene.restart();


                });

                this.botaoRestart.on('pointerover', () => {
                    this.botaoRestart.setBackgroundColor('#8d8d8d');
                });

                this.botaoRestart.on('pointerout', () => {
                    this.botaoRestart.setBackgroundColor('#2d2d2d');
                });

                this.botaoMenu = this.add.text(width / 2, 515, 'Menu', {
                    fontSize: '24px',
                    fill: '#FFF',
                    backgroundColor: '#2d2d2d',
                    fontFamily: 'Helvetica',
                    padding: { x: 16, y: 10 }
                }).setOrigin(0.5, 0.5);
                this.botaoMenu.setInteractive({ useHandCursor: true });
                this.botaoMenu.on('pointerdown', () => {
                    this.salvou = false;
                    this.scene.start('MainMenu')

                });

                this.botaoMenu.on('pointerover', () => {
                    this.botaoMenu.setBackgroundColor('#8d8d8d');
                });

                this.botaoMenu.on('pointerout', () => {
                    this.botaoMenu.setBackgroundColor('#2d2d2d');
                });

                this.restart = true;
                this.start = false;
            }
        }

        if (this.contarDestruidos() == 20) {
            this.bola_destruida_x = this.bola.x
            this.bola_destruida_y = this.bola.y
            this.bola.setVelocityX(0)
            this.bola.setVelocityY(0)
            this.animarSumirBola()

            if (!this.end) {
                setTimeout(() => {
                    this.textoNivelConcluido = this.add.text(this.bola_destruida_x, this.bola_destruida_y, 'Nível concluído', {
                        fontSize: '24px',
                        fill: '#fff',
                        fontFamily: 'Helvetica'
                    }).setScale(0.1).setOrigin(0.5, 0.5).setShadow(2, 2, '#77FF00', 10, false, true);;
                }, 700)
                this.end = true;
            }
            this.tweens.add({
                targets: this.textoNivelConcluido,
                scaleX: 1,
                scaleY: 1,
                x: width / 2,
                y: 400,
                duration: 1000,
                ease: 'Linear',
            })

            if (!this.salvou) {
                this.addScore(this.player, this.pontuacao)
                this.salvou = true
            }

            this.proximoNivel = this.add.text(width / 2, 465, 'Próximo Nível', {
                fontSize: '24px',
                fill: '#FFF',
                backgroundColor: '#2d2d2d',
                fontFamily: 'Helvetica',
                padding: { x: 16, y: 10 }
            }).setOrigin(0.5, 0.5);
            this.proximoNivel.setInteractive({ useHandCursor: true });
            this.proximoNivel.on('pointerdown', () => {
                this.salvou = false;
                this.registry.set('pontuacao_atual', this.pontuacao);
                this.registry.set('vidas', this.vidas);
                this.scene.start('Fase2')

            });

            this.proximoNivel.on('pointerover', () => {
                this.proximoNivel.setBackgroundColor('#8d8d8d');
            });

            this.proximoNivel.on('pointerout', () => {
                this.proximoNivel.setBackgroundColor('#2d2d2d');
            });


            this.botaoMenu = this.add.text(width / 2, 515, 'Menu', {
                fontSize: '24px',
                fill: '#FFF',
                backgroundColor: '#2d2d2d',
                fontFamily: 'Helvetica',
                padding: { x: 16, y: 10 }
            }).setOrigin(0.5, 0.5);
            this.botaoMenu.setInteractive({ useHandCursor: true });
            this.botaoMenu.on('pointerdown', () => {
                this.salvou = false;
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

    gerarAleatorio(inicio, fim) {
        return String(Math.floor(Math.random() * fim) + inicio);
    }

    atualizarScore(bloco) {
        bloco.destroy();
        this.pontuacao += this.extrairNumero(bloco.texture.key) * this.vidas;
        this.textoScore.setText('Pontuação: ' + this.pontuacao);
    }

    extrairNumero(texto) {
        var numero = (texto.split('_')[1])
        return parseInt(numero);
    }

    contarDestruidos() {
        var contagem = []
        this.blocos.every(element => contagem.push(element.children.entries.length));
        return 20 - contagem.reduce((contador, valor) => contador + valor, 0)
    }

    sem_vidas() {
        if (!this.fimDeJogo) {
            const { width, height } = this.sys.game.config;
            this.bola.destroy()
            this.textoFimDeJogo = this.add.text(width / 2, 400, 'Fim de jogo', {
                fontSize: '32px',
                fill: '#fff',
                fontFamily: 'Helvetica'
            }).setOrigin(0.5, 0.5).setShadow(2, 2, '#FF0000', 10, false, true);
            this.fimDeJogo = true;
            if (!this.salvou) {
                this.addScore(this.player, this.pontuacao)
                this.salvou = true
            }
        }

    }

    animarSumirBola() {
        const shrinkAnimation = this.tweens.add({
            targets: this.bola,
            scaleX: 0,
            scaleY: 0,
            duration: 700,
            ease: 'Linear',

            onComplete: () => {
                this.bola.setVisible(false);

            }
        });
    }
}