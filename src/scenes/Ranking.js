import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, query, orderBy, limit, getDocs } from "firebase/firestore";

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


export default class Ranking extends Scene {
    constructor() {
        super('Ranking')
    }

    async getScores() {
        const scoresQuery = query(collection(db, 'pontuacao'), orderBy('pontos', 'desc'), limit(5));
        const scoresResp = await getDocs(scoresQuery);
        const lista = scoresResp.docs.map(doc => doc.data());
        
        return lista
    }

    preload() {

    }

    create() {
        this.getScores().then((data) => {
            this.atualizarScores(data);
            
        }).catch((error) => {
            console.error(error)
        })


        const { width, height } = this.sys.game.config;
        this.titulo = this.add.text(width / 2, 50, 'Ranking', {
            fontSize: '36px',
            fill: '#FFF',
            fontFamily: 'Helvetica',
            padding: { x: 16, y: 10 }
        }).setOrigin(0.5, 0.5);

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

    atualizarScores(data) {
        data.forEach((element, index) => {
            const texto = this.add.text(80, 150 + (50 * index), element.nome, {
                fontSize: '28px',
                fill: '#FFF',
                fontFamily: 'Helvetica',
                padding: { x: 16, y: 10 }
            });

            const pontos = this.add.text(450, 150 + (50 * index), element.pontos, {
                fontSize: '28px',
                fill: '#FFF',
                fontFamily: 'Helvetica',
                padding: { x: 16, y: 10 }
            });
            this.alignTextRight(pontos,500)
        })

        
    }

    alignTextRight(textObject, width) {
        textObject.setOrigin(1, 0);
        textObject.x = width;
    }
}