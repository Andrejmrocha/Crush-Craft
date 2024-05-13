const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    backgroundColor: "#000000",
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var playerName = document.currentScript.getAttribute('data-player-name');
var contexto;

var barra;
var bola;
var blocos;
var cursor;

var score = 0;
var scoreText;
var startText;
var endGameText;

var gameOver = false;
var velocidadeX = 200;
var velocidadeY = -200;
var jogoIniciou = true;
var startGame = false;
var end = false;

var blocos_destruidos = 0;
var bola_destruida_x;
var bola_destruida_y;
var centro;

var vidas = 5;
var vidas_grupo;
var game = new Phaser.Game(config);
var restart = false;

function preload (){
    this.load.image('bloco_1', 'assets/bloco_1.png')
    this.load.image('bloco_verde', 'assets/bloco_verde.png')
    this.load.image('bloco_amarelo', 'assets/bloco_amarelo.png')
    this.load.image('barra', 'assets/barra_m.png')
    this.load.image('bola', 'assets/ball.png')
    this.load.image('vida', 'assets/life_full.png')
    this.load.image('vida_invert', 'assets/life_full_invert.png')
    this.load.image('vida_vazia', 'assets/life.png')
    this.load.image('vida_vazia_invert', 'assets/life_invert.png')
}

function create (){
    
    const numLinhas = 5;
    const numColunas = 11;
    var cor = '1'
    centro = this.cameras.main.width/2;
    blocos = [];
    for (let linha = 0; linha < numLinhas; linha++){
        if (linha >= 3) {
            cor = '1';
        }
        if (linha >= 6) {
            cor = '1'
        }
        
        const linhaBlocos = this.physics.add.staticGroup({
            key: 'bloco_' + cor,
            frameQuantity: 1,
            repeat: numColunas - 1,
            setXY: { x:40, y:100 + linha * 51, stepX: 51},
        });
        
        blocos.push(linhaBlocos);
    }

    vidas_grupo = [];
    for (let i = 450, x = 1; i < 531; i = i + 20){
        if(x % 2 != 0){
            vidas_grupo.push(this.physics.add.image(i , 30, 'vida'))
        } else {
            vidas_grupo.push(this.physics.add.image(i , 30, 'vida_invert'))
        }
        
        x ++;
    }
    

    barra = this.physics.add.image(315, 550, 'barra');
    barra.setImmovable(true);
    barra.setCollideWorldBounds(true);
    barra.body.allowGravity = false;
    
    this.startText = this.add.text(200, 300, 'Pressione Enter iniciar', {fontSize: '24px', fill: '#fff', fontFamily: 'Helvetica'});
    this.tweens.add({
        targets: this.startText,
        alpha: 0,
        duration: 500,
        ease: 'Power2',
        yoyo: true,
        repeat: -1
    });

    bola = this.physics.add.sprite(315, 450, 'bola');
    bola.setCollideWorldBounds(true)
    bola.setBounce(1, 1)

    cursor = this.input.keyboard.createCursorKeys();

    blocos.forEach(function(linhaBlocos) {
        linhaBlocos.children.iterate(function(bloco) {
            this.physics.add.collider(bola, bloco, function() {
                const shrinkAnimation = this.tweens.add({
                    targets: bloco,
                    scaleX: 0.6,
                    scaleY: 0.6,
                    duration: 50,
                    ease: 'Linear',
                    
                    onComplete: function() {
                        bloco.destroy()
                        destruir_bloco(bloco);
                        blocos_destruidos += 1;
                    }
                });
            }, null, this);
        }, this);
    }, this);

    scoreText = this.add.text(16,16, 'score: 0', { fontSize: '24px', fill: '#fff', fontFamily: 'Helvetica'});
    
}

function update(){
    document.addEventListener('keydown', function(event) {
        if (!startGame && event.key === "Enter" && jogoIniciou ) {
            jogoIniciou = false;
        }
    });

    if(!jogoIniciou) {
        window.removeEventListener('keydown', this)
        this.startText.destroy();
        bola.setVelocityX(velocidadeX);
        bola.setVelocityY(velocidadeY);
        jogoIniciou = true
    }
    
    if (cursor.left.isDown) {
        if (cursor.shift.isDown) {
            barra.setVelocityX(-400)
        } else {
            barra.setVelocityX(-200)
        }
        
    }
    else if (cursor.right.isDown) {
        if (cursor.shift.isDown) {
            barra.setVelocityX(400)    
        } else {
            barra.setVelocityX(200)
        }
        
    }

    else {
        barra.setVelocityX(0)
    }
    
    this.physics.collide(bola, barra, function(){
        velocidadeY = -velocidadeY;
        
    })
    
    for (let i = 0; i < blocos.length; i++){
        this.physics.collide(bola, blocos[i], function(bola, bloco){
            bloco.destroy()
            velocidadeY = -velocidadeY;
        })
    }

    if (blocos_destruidos >= 100) {
        bola_destruida_x = bola.x
        bola_destruida_y = bola.y
        bola.setVelocityX(0)
        bola.setVelocityY(0)
        animarSumirBola.call(this)
        contexto = this
        if (!end) {
            setTimeout(function(){
                
                endGameText = contexto.add.text(bola_destruida_x, bola_destruida_y, 'Fase concluída', {fontSize: '48px', fill: '#fff', fontFamily: 'Helvetica'})
                endGameText.setScale(0.1)
            }, 700)
            end = true
        }
        this.tweens.add({
            targets: endGameText,
            scaleX: 1,
            scaleY: 1,
            x: centro-100,
            duration: 1000,
            ease: 'Linear',
        })
                
    }
    
    
    if (bola.y >= 590){
        vidas -= 1;
        bola.setX(315);
        bola.setY(450);
        bola.setVelocityX(0)
        bola.setVelocityY(0)
        velocidadeY = -Math.abs(velocidadeY);


        if (vidas > 0) {
            const restartText = this.add.text(100, 300, 'Pressione qualquer tecla para reiniciar', {fontSize: '24px', fill: '#fff', fontFamily: 'Helvetica'});
            this.tweens.add({
                targets: restartText,
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                yoyo: true,
                repeat: -1
            });
            this.input.keyboard.once('keydown', function(event) {
                restartText.destroy();
                jogoIniciou = true;
                
                bola.setVelocityX(velocidadeX);
                bola.setVelocityY(velocidadeY);
            });
        } else {
            sem_vidas.call(this);
            gameOver = true;
        }
    }

    if (vidas == 4){
        vidas_grupo[4].destroy();
        vidas_grupo.push(this.physics.add.image(530,30, 'vida_vazia'))
    } else if (vidas == 3){
        vidas_grupo[3].destroy();
        vidas_grupo.push(this.physics.add.image(510,30, 'vida_vazia_invert'))
    } else if (vidas == 2){
        vidas_grupo[2].destroy();
        vidas_grupo.push(this.physics.add.image(490,30, 'vida_vazia'))
    } else if (vidas == 1){
        vidas_grupo[1].destroy();
        vidas_grupo.push(this.physics.add.image(470,30, 'vida_vazia_invert'))
    } else if (vidas == 0){
        vidas_grupo[0].destroy();
        vidas_grupo.push(this.physics.add.image(450,30, 'vida_vazia'))
        sem_vidas.call(this)
        gameOver = true;
    }
}

function destruir_bloco(bloco){
    console.log(bloco.texture.key)
    score += 10
    scoreText.setText('score: ' + score)
    
}

function check_fase_concluida(){
    if (blocos_destruidos >= 3){
        end = true;        
    }
}

function animarSumirBola() {
    const shrinkAnimation = this.tweens.add({
        targets: bola,
        scaleX: 0,
        scaleY: 0,
        duration: 700,
        ease: 'Linear',

        onComplete: function() {          
            bola.setVisible(false);
            
        }
    });
}

function sem_vidas(){
    if(!gameOver){
        bola.destroy()
        endGameText = this.add.text(200, 300, 'Game Over', {fontSize: '48px', fill: '#fff', fontFamily: 'Roboto'})
        setTimeout(() => {
            this.scene.restart();
            vidas = 5
            score = 0
            jogoIniciou = false
        }, "1000")
    }
    
}
