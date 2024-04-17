const config = {
    type: Phaser.AUTO,
    width: 631,
    height: 600,
    backgroundColor: "#333333",
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

var contexto;
var barra;
var bola;
var score = 0;
var scoreText;
var endGameText;
var gameOver = false;
var blocos;
var cursor;
var velocidadeX = 200;
var velocidadeY = -200;
var jogoIniciou = false;
var end = false;
var blocos_destruidos = 0;
var bola_destruida_x;
var bola_destruida_y;
var centro;
var vidas = 5;
var vidas_grupo;
var game = new Phaser.Game(config);

function preload (){
    this.load.image('bloco_azul', 'assets/bloco_azul.png')
    this.load.image('bloco_verde', 'assets/bloco_verde.png')
    this.load.image('bloco_amarelo', 'assets/bloco_amarelo.png')
    this.load.image('barra', 'assets/barra.png')
    this.load.image('bola', 'assets/ball.png')
    this.load.image('vida', 'assets/life_full.png')
    this.load.image('vida_invert', 'assets/life_full_invert.png')
    this.load.image('vida_vazia', 'assets/life.png')
    this.load.image('vida_vazia_invert', 'assets/life_invert.png')
}

function create (){

    const numLinhas = 6;
    const numColunas = 10;
    var cor = 'azul'
    centro = this.cameras.main.width/2;
    blocos = [];
    for (let linha = 0; linha < numLinhas; linha++){
        if (linha >= 3) {
            cor = 'amarelo';
        }
        if (linha >= 6) {
            cor = 'verde'
        }
        
        const linhaBlocos = this.physics.add.staticGroup({
            key: 'bloco_' + cor,
            frameQuantity: 1,
            repeat: numColunas - 1,
            setXY: { x:40, y:100 + linha * 32, stepX: 61},
        });
        
        blocos.push(linhaBlocos);
    }

    vidas_grupo = [];
    for (let i = 520, x = 1; i < 601; i = i + 20){
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
    

    bola = this.physics.add.sprite(315, 450, 'bola');
    bola.setCollideWorldBounds(true)
    bola.setBounce(1, 1)

    cursor = this.input.keyboard.createCursorKeys();
    blocos.forEach(function(linhaBlocos) {
        linhaBlocos.children.iterate(function(bloco) {
            this.physics.add.collider(bola, bloco, function() {
                // Inicie a animação no bloco
                const shrinkAnimation = this.tweens.add({
                    targets: bloco,
                    scaleX: 0.1, // Escala horizontal (X) final
                    scaleY: 0.1, // Escala vertical (Y) final
                    duration: 50, // Duração da animação em milissegundos
                    ease: 'Linear', // Efeito de transição (opcional)
                    
                    onComplete: function() {
                        bloco.destroy()
                        destruir_bloco();
                        blocos_destruidos += 1;
                        console.log("blocos" + blocos_destruidos)
                    }
                });
            }, null, this);
        }, this);
    }, this);

    scoreText = this.add.text(16,16, 'score: 0', { fontSize: '24px', fill: '#fff', fontFamily: 'Helvetica'});
    
    
}

function update(){
    if(!jogoIniciou) {
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

    if (blocos_destruidos >= 60) {
        bola_destruida_x = bola.x
        bola_destruida_y = bola.y
        bola.setVelocityX(0)
        bola.setVelocityY(0)
        animarSumirBola.call(this)
        contexto = this
        if (!end) {
            setTimeout(function(){
                
                endGameText = contexto.add.text(bola_destruida_x, bola_destruida_y, 'Fase concluída', {fontSize: '48px', fill: '#fff', fontFamily: 'Roboto'})
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
    
    
    if (bola.y >= 592){
        vidas -= 1;
        
    }

    if (vidas == 4){
        vidas_grupo[4].destroy();
        vidas_grupo.push(this.physics.add.image(600,30, 'vida_vazia'))
    } else if (vidas == 3){
        vidas_grupo[3].destroy();
        vidas_grupo.push(this.physics.add.image(580,30, 'vida_vazia_invert'))
    } else if (vidas == 2){
        vidas_grupo[2].destroy();
        vidas_grupo.push(this.physics.add.image(560,30, 'vida_vazia'))
    } else if (vidas == 1){
        vidas_grupo[1].destroy();
        vidas_grupo.push(this.physics.add.image(540,30, 'vida_vazia_invert'))
    } else if (vidas == 0){
        vidas_grupo[0].destroy();
        vidas_grupo.push(this.physics.add.image(520,30, 'vida_vazia'))
        sem_vidas.call(this)
        gameOver = true;
    }
}

function destruir_bloco(bola, bloco){
    score += 10
    scoreText.setText('score: ' + score)
    
}

function check_fase_concluida(){
    if (blocos_destruidos >= 3){
        end = true;        
    }
}

function animarSumirBola() {
    // Cria uma animação para reduzir o tamanho da bola até zero
    const shrinkAnimation = this.tweens.add({
        targets: bola,
        scaleX: 0, // Escala horizontal (X) final
        scaleY: 0, // Escala vertical (Y) final
        duration: 700, // Duração da animação em milissegundos
        ease: 'Linear', // Efeito de transição (opcional)

        onComplete: function() {
            // Executa após a animação ser concluída
            // Oculta a bola
            
            bola.setVisible(false);
            
        }
    });
}

function sem_vidas(){
    if(!gameOver){
        bola.destroy()
        endGameText = this.add.text(200, 300, 'Game Over', {fontSize: '48px', fill: '#fff', fontFamily: 'Roboto'})
    }
    
}
