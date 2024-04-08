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

var barra;
var bola;
var bloco;
var score = 0;
var scoreText;
var gameOver = false;
var scoreText;
var grade;
var blocos;
var cursors;
var velocidadeX = 200;
var velocidadeY = -200;
var jogoIniciou = false;

var game = new Phaser.Game(config);

function preload (){
    this.load.image('bloco_azul', 'assets/bloco_azul.png')
    this.load.image('bloco_verde', 'assets/bloco_verde.png')
    this.load.image('bloco_amarelo', 'assets/bloco_amarelo.png')
    this.load.image('barra', 'assets/barra.png')
    this.load.image('bola', 'assets/ball.png')
}

function create (){

    const numLinhas = 9;
    const numColunas = 10;
    var cor = 'azul'

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

    barra = this.physics.add.image(315, 550, 'barra');
    barra.setImmovable(true);
    barra.setCollideWorldBounds(true);
    barra.body.allowGravity = false;
    

    bola = this.physics.add.sprite(315, 450, 'bola');
    bola.setCollideWorldBounds(true)
    bola.setBounce(1, 1)

    cursors = this.input.keyboard.createCursorKeys();
    blocos.forEach(function(linhaBlocos) {
        linhaBlocos.children.iterate(function(bloco) {
            this.physics.add.collider(bola, bloco, function() {
                // Inicie a animação no bloco
                const shrinkAnimation = this.tweens.add({
                    targets: bloco,
                    scaleX: 0.1, // Escala horizontal (X) final
                    scaleY: 0.1, // Escala vertical (Y) final
                    duration: 500, // Duração da animação em milissegundos
                    ease: 'Linear', // Efeito de transição (opcional)
                    
                    onComplete: function() {
                        destruir_bloco();
                        bloco.destroy()
                    }
                });
            }, null, this);
        }, this);
    }, this);

    scoreText = this.add.text(16,16, 'score: 0', { fontSize: '32px', fill: '#fff'});
}

function update(){
    if(!jogoIniciou) {
        bola.setVelocityX(velocidadeX);
        bola.setVelocityY(velocidadeY);
        jogoIniciou = true
    }
    
    if (cursors.left.isDown) {
        if (cursors.shift.isDown) {
            barra.setVelocityX(-400)
        } else {
            barra.setVelocityX(-200)
        }
        
    }
    else if (cursors.right.isDown) {
        if (cursors.shift.isDown) {
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
}

function destruir_bloco(bola, bloco){
    score += 10
    scoreText.setText('Score: ' + score)
}
