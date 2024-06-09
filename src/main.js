import Phaser from "phaser";
import MainMenu from "./scenes/MainMenu";
import Ranking from "./scenes/Ranking";
import Tutorial from "./scenes/Tutorial";
import Fase1 from "./scenes/Fase1";
import Fase2 from "./scenes/Fase2";
import Fase3 from "./scenes/Fase3";
import Creditos from "./scenes/Creditos";


const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  parent: 'game-container',
  
  scene: [MainMenu, Tutorial, Ranking, Creditos, Fase1, Fase2, Fase3],
  physics: {
    default: 'arcade',
    arcade: {
        debug: false
    }
  },
  dom: {
    createContainer: true
  }
};

export default new Phaser.Game(config);
