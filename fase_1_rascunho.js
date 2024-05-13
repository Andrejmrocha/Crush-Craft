const tamanho = 660

const config = {
    type: Phaser.AUTO,
    width: tamanho,
    height: tamanho,
    backgroundColor: "#000000",
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var jogoIniciou = false;
var gameOver = false;
var barra, cursor, textoScore, vidasGrupo;
var velocidade = 300;
var blocosDestruidos = 0;
var score = 0
var vidas = 5;
var ultimaVelocidade;
var velocidadeAumentada = false;

function preload() {
    for (let bloco = 1; bloco < 10; bloco++) {
        this.load.image(`bloco_${bloco}`, `assets/bloco_${bloco}.png`)

    }
    this.load.image('barra', 'assets/barra_m.png');
    this.load.image('bola', 'assets/ball.png');
    this.load.image('vida', 'assets/life_full.png')
    this.load.image('vida_invert', 'assets/life_full_invert.png')
    this.load.image('vida_vazia', 'assets/life.png')
    this.load.image('vida_vazia_invert', 'assets/life_invert.png')
}

function create() {
    var quantidadeLinhas = 5
    var quantidadeColunas = 12

    blocos = [];
    for (let linha = 0; linha < quantidadeLinhas; linha++) {
        var linhaBlocos = this.physics.add.staticGroup();
        for (let coluna = 0; coluna < quantidadeColunas; coluna++) {
            var numero = String(Math.floor(Math.random() * 9) + 1);
            var bloco = linhaBlocos.create(50 + coluna * 51, 80 + linha * 51, 'bloco_' + numero);
        }

        blocos.push(linhaBlocos);
    }

    barra = this.physics.add.image(315, 590, 'barra');
    barra.setImmovable(true);
    barra.setCollideWorldBounds(true);


    bola = this.physics.add.sprite(315, 450, 'bola');
    bola.setCollideWorldBounds(true);
    bola.setBounce(1, 1);

    this.startText = this.add.text(200, 500, 'Pressione Enter iniciar', { fontSize: '24px', fill: '#fff', fontFamily: 'Helvetica' });
    this.tweens.add({
        targets: this.startText,
        alpha: 0,
        duration: 800,
        ease: 'Power2',
        yoyo: true,
        repeat: -1
    });

    cursor = this.input.keyboard.createCursorKeys();

    blocos.forEach(function (linhaBlocos) {
        linhaBlocos.children.iterate(function (bloco) {
            this.physics.add.collider(bola, bloco, function () {
                const shrinkAnimation = this.tweens.add({
                    targets: bloco,
                    scaleX: 0.6,
                    scaleY: 0.6,
                    duration: 60,
                    ease: 'Linear',

                    onComplete: function () {
                        bloco.destroy()
                        atualizarScore(bloco)
                        atualizarVelocidade()
                    }
                });
            }, null, this);
        }, this);
    }, this);

    textoScore = this.add.text(24, 16, 'score: 0', { fontSize: '24px', fill: '#fff', fontFamily: 'Helvetica' });
    vidasGrupo = [];
    for (let i = 450, x = 1; i < 531; i = i + 20) {
        if (x % 2 != 0) {
            vidasGrupo.push(this.physics.add.image(i, 30, 'vida'))
        } else {
            vidasGrupo.push(this.physics.add.image(i, 30, 'vida_invert'))
        }

        x++;
    }
}

function update() {
    document.addEventListener('keydown', function (event) {
        if (event.key === "Enter" && !jogoIniciou) {
            jogoIniciou = true;
        }
    });

    if (jogoIniciou) {
        window.removeEventListener('keydown', this)
        this.startText.destroy();
        bola.setVelocityX(Math.floor(Math.random() * 200) + 150);
        bola.setVelocityY(-velocidade);
        jogoIniciou = false
    }

    if (cursor.left.isDown) {
        if (cursor.shift.isDown) {
            barra.setVelocityX(-900)
        } else {
            barra.setVelocityX(-500)
        }

    }
    else if (cursor.right.isDown) {
        if (cursor.shift.isDown) {
            barra.setVelocityX(900)
        } else {
            barra.setVelocityX(500)
        }

    }

    else {
        barra.setVelocityX(0)
    }
    this.physics.collide(bola, barra, function () {


    })

    if (bola.y >= 630) {
        ultimaVelocidade = bola.body.velocity.x
        vidas -= 1;
        bola.setX(315);
        bola.setY(450);
        bola.setVelocityX(0)
        bola.setVelocityY(0)


        if (vidas > 0) {
            const restartText = this.add.text(150, 500, 'Pressione qualquer tecla para reiniciar', { fontSize: '24px', fill: '#fff', fontFamily: 'Helvetica' });
            this.tweens.add({
                targets: restartText,
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                yoyo: true,
                repeat: -1
            });
            this.input.keyboard.once('keydown', function (event) {
                restartText.destroy();

                bola.setVelocityX(ultimaVelocidade);
                if (blocosDestruidos <= 12) {
                    bola.setVelocityY(-300);
                } else if (blocosDestruidos < 24) {
                    bola.setVelocityY(-350);
                } else if (blocosDestruidos < 36) {
                    bola.setVelocityY(-430);
                } else if (blocosDestruidos < 48) {
                    bola.setVelocityY(-550);
                } else {
                    bola.setVelocityY(-710);
                }


            });
        } else {
            sem_vidas.call(this);
            gameOver = true;
        }
    }

    if (vidas == 4) {
        vidasGrupo[4].destroy();
        vidasGrupo.push(this.physics.add.image(530, 30, 'vida_vazia'))
    } else if (vidas == 3) {
        vidasGrupo[3].destroy();
        vidasGrupo.push(this.physics.add.image(510, 30, 'vida_vazia_invert'))
    } else if (vidas == 2) {
        vidasGrupo[2].destroy();
        vidasGrupo.push(this.physics.add.image(490, 30, 'vida_vazia'))
    } else if (vidas == 1) {
        vidasGrupo[1].destroy();
        vidasGrupo.push(this.physics.add.image(470, 30, 'vida_vazia_invert'))
    } else if (vidas == 0) {
        vidasGrupo[0].destroy();
        vidasGrupo.push(this.physics.add.image(450, 30, 'vida_vazia'))
        sem_vidas.call()
        var restartButton = this.add.text(200, 500, 'Restart', { fontSize: '24px', fill: '#FFF' });
        restartButton.setInteractive(); 
        restartButton.on('pointerdown', function () {
            
            this.scene.scene.restart();
            restartButton.destroy()

        });

    }

}

function atualizarScore(bloco) {
    var pontos = parseInt(bloco.texture.key.split('_')[1]);
    score += pontos;
    blocosDestruidos += 1;
    textoScore.setText('score: ' + score);
}

function atualizarVelocidade() {
    switch (blocosDestruidos) {
        case 12:
            if (bola.body.velocity.x < 0) bola.setVelocityX(bola.body.velocity.x - 50)
            else bola.setVelocityX(bola.body.velocity.x + 50)
            bola.setVelocityY(350)
            break;

        case 24:
            if (bola.body.velocity.x < 0) bola.setVelocityX(bola.body.velocity.x - 80)
            else bola.setVelocityX(bola.body.velocity.x + 80)
            bola.setVelocityY(430)
            break;

        case 36:
            if (bola.body.velocity.x < 0) bola.setVelocityX(bola.body.velocity.x - 120)
            else bola.setVelocityX(bola.body.velocity.x + 120)
            bola.setVelocityY(550)
            break;

        case 48:
            if (bola.body.velocity.x < 0) bola.setVelocityX(bola.body.velocity.x - 160)
            else bola.setVelocityX(bola.body.velocity.x + 160)
            bola.setVelocityY(710)
            break;

        default:
            break;
    }
}

function sem_vidas() {
    if (!gameOver) {
        bola.destroy()
        const endGameText = this.add.text(200, 300, 'Game Over', { fontSize: '48px', fill: '#fff', fontFamily: 'Helvetica' })


    }

}