import Phaser from "phaser";
import MainMenu from "./scenes/MainMenu";
import Stage1 from "./scenes/Stage1";


const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  parent: 'game-container',
  
  scene: [MainMenu, Stage1],
  physics: {
    default: 'arcade',
    arcade: {
        debug: false
    }
},
};

export default new Phaser.Game(config);
