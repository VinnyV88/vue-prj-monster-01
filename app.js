function getRandomValue(min, max) {
  //The below Math formula randomly chooses a number between 5 and 12
  const attackValue = Math.floor(Math.random() * (max - min)) + min;
  return attackValue;
}

const vApp = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      playerHealth: 100,
      currentRound: 0,
      gameOver: false,
      tieGame: false,
      playerWon: false,
      monsterWon: false,
      battleLog: [],
    };
  },
  watch: {
    monsterHealth(value) {
      if (!this.gameOver) {
        if (value <= 0) {
          this.gameOver = true;
          if (this.playerHealth <= 0) {
            this.tieGame = true;
          } else {
            this.playerWon = true;
          }
        }
      }
    },
    playerHealth(value) {
      if (!this.gameOver) {
        if (value <= 0) {
          this.gameOver = true;
          if (this.monsterHealth <= 0) {
            this.tieGame = true;
          } else {
            this.monsterWon = true;
          }
        }
      }
    },
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      } else {
        return {
          width: this.monsterHealth + "%",
        };
      }
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      } else {
        return {
          width: this.playerHealth + "%",
        };
      }
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  methods: {
    attackMonster() {
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.currentRound++;
      this.addLogMessage(this.currentRound, "Player", "attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addLogMessage(this.currentRound, "Monster", "attack", attackValue);
    },
    specialAttack() {
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.currentRound++;
      this.addLogMessage(
        this.currentRound,
        "Player",
        "special-attack",
        attackValue
      );
      this.attackPlayer();
    },
    healPlayer() {
      const healValue = getRandomValue(8, 20);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.currentRound++;
      this.addLogMessage(this.currentRound, "Player", "heal", healValue);
      this.attackPlayer();
    },
    addLogMessage(round, who, what, value) {
      this.battleLog.unshift({
        actionRound: round,
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
    surrender() {
      this.gameOver = true;
      this.monsterWon = true;
    },
    resetGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.gameOver = false;
      this.playerWon = false;
      this.monsterWon = false;
      this.tieGame = false;
      this.currentRound = 0;
      this.battleLog = [];
    },
  },
});

vApp.mount("#game");
