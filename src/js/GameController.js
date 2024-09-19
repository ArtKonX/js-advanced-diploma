import themes from "./themes";

import cursors from './cursors';

import { getDistance, getRandomIndex } from "./utils";

import GamePlay from "./GamePlay";
import GameState from "./GameState";

import PositionedCharacter from "./PositionedCharacter";

import Team from "./Team";

import Bowman from "./characters/playerClasses/Bowman";
import Swordsman from "./characters/playerClasses/Swordsman";
import Magician from "./characters/playerClasses/Magician";

import Vampire from "./characters/enemyClasses/Vampire";
import Undead from "./characters/enemyClasses/Undead";
import Daemon from "./characters/enemyClasses/Daemon";

import { generateTeam, characterGenerator } from "./generators";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.playersTeam = new Team();
    this.enemysTeam = new Team();
    this.players = [Bowman, Swordsman, Magician];
    this.enemys = [Vampire, Undead, Daemon];

    this.addEventListeners();
  }

  init() {

    this.gamePlay.drawUi(themes.levelOne);
    this.playersTeam = new Team();
    this.enemysTeam = new Team();
    this.gameState.charactersList = [];

    this.playersTeam.addAll(generateTeam(this.players, 1, 2));
    this.enemysTeam.addAll(generateTeam(this.enemys, 1, 2));
    this.addCharactersPosition(this.playersTeam, this.getPlayerPositions());
    this.addCharactersPosition(this.enemysTeam, this.getEnemyPositions());

    const load = this.stateService.load();
    this.gameState.statistic = load.statistic;

    this.gamePlay.redrawPositions(this.gameState.charactersList);
  }

  addEventListeners() {

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

    this.gamePlay.addNewGameListener(() => {
      this.startingNewGame();
    });
    this.gamePlay.addSaveGameListener(() => {
      this.savingGame();
    });
    this.gamePlay.addLoadGameListener(() => {
      this.loadingSaveGame();
    });
  }

  nextLevel() {
    this.gameState.level++
    for (const player of this.playersTeam.characters) {
      player.levelUp();
    }
  }

  switchLevel() {

    let newPlayer;

    switch (this.gameState.level) {
      case 1:
        this.gamePlay.drawUi(themes.levelOne);
        this.playersTeam.add(characterGenerator(this.players, 1).next().value);
        this.addCharacterPosition(this.playersTeam, this.getPlayerPositions());
        this.gamePlay.redrawPositions(this.gameState.charactersList);
        break

      case 2:
        this.gamePlay.drawUi(themes.levelTwo);
        newPlayer = characterGenerator(this.players, 1).next().value
        this.playersTeam.add(newPlayer);
        this.enemysTeam.addAll(generateTeam(this.enemys, 2, 2));
        this.addCharacterPosition(newPlayer, this.getPlayerPositions());
        this.addCharactersPosition(this.enemysTeam, this.getEnemyPositions());
        this.gamePlay.redrawPositions(this.gameState.charactersList);
        break

      case 3:
        this.gamePlay.drawUi(themes.levelThree);
        newPlayer = characterGenerator(this.players, 1).next().value
        this.playersTeam.add(newPlayer);
        this.enemysTeam.addAll(generateTeam(this.enemys, 3, 2));
        this.addCharacterPosition(newPlayer, this.getPlayerPositions());
        this.addCharactersPosition(this.enemysTeam, this.getEnemyPositions());
        this.gamePlay.redrawPositions(this.gameState.charactersList);
        break

      case 4:

        this.gamePlay.drawUi(themes.levelFour);
        newPlayer = characterGenerator(this.players, 1).next().value
        this.playersTeam.add(newPlayer);
        this.enemysTeam.addAll(generateTeam(this.enemys, 4, 2));
        this.addCharacterPosition(newPlayer, this.getPlayerPositions());
        this.addCharactersPosition(this.enemysTeam, this.getEnemyPositions());
        this.gamePlay.redrawPositions(this.gameState.charactersList);
        break
    }
  }

  enemyAttack() {

    const playersTeam = this.gameState.charactersList.filter((char) => (char.character instanceof Bowman || char.character instanceof Swordsman || char.character instanceof Magician));
    const enemysTeam = this.gameState.charactersList.filter((char) => (char.character instanceof Vampire || char.character instanceof Undead || char.character instanceof Daemon));

    let playerCurrent = null;
    let enemyCurrent = null;

    for (const player of playersTeam) {
      for (const enemy of enemysTeam) {
        const distance = getDistance(enemy.position, enemy.character, this.gamePlay.boardSize, 'attack')
        if (distance.includes(player.position)) {
          playerCurrent = player;
          enemyCurrent = enemy;
        }
      }
    }

    if (playerCurrent) {
      this.gamePlay.selectCell(playerCurrent.position, 'red')
      const damage = Math.max(enemyCurrent.character.attack - playerCurrent.character.defence, enemyCurrent.character.attack * 0.1)
      this.gamePlay.showDamage(playerCurrent.position, damage).then(() => {
        playerCurrent.character.health -= damage;

        if (playerCurrent.character.health <= 0) {
          this.delectChar(playerCurrent.position)
          this.playersTeam.deleteCharacter(playerCurrent.character)
        }
      }).then(() => {
        this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-red'))
        this.gamePlay.redrawPositions(this.gameState.charactersList)
        this.gameState.playerSelected = null
      }).then(() => {
        this.gameStatistic();
      })

    } else {
      enemyCurrent = enemysTeam[Math.floor(Math.random() * enemysTeam.length)]
      if (!enemyCurrent) return
      const distance = getDistance(enemyCurrent.position, enemyCurrent.character, this.gamePlay.boardSize, 'attack')
      for (const cell of distance) {
        for (const char of this.gameState.charactersList) {
          if (cell === char.position) {
            distance.splice(distance.indexOf(char.position), 1)
          }
        }
      }

      const randomPosition = getRandomIndex(this.getEnemyPositions());
      enemyCurrent.position = randomPosition;
      this.gamePlay.redrawPositions(this.gameState.charactersList);
    }

  }

  gameStatistic() {

    let totalPoints = this.gameState.statistic.reduce((a, b) => a + b, 0)

    if (this.playersTeam.characters.size === 0) {
      this.gameState.statistic.push(this.gameState.points);
      GamePlay.showMessage(`Вы проиграли! У вас очков - ${totalPoints + this.gameState.points}!`);
    }

    if (this.enemysTeam.characters.size === 0 && this.gameState.level < 4) {
      this.gameState.statistic.push(this.gameState.points);
      this.nextLevel();
      GamePlay.showMessage(`Вы перешли на уровень ${this.gameState.level}! У вас очков за уровень - ${this.gameState.points}!`);
      this.switchLevel();
    }

    if (this.enemysTeam.characters.size === 0 && this.gameState.level === 4) {
      this.gameState.statistic.push(this.gameState.points);
      GamePlay.showMessage(`Вы прошли игру! У вас очков ${totalPoints + this.gameState.points}!`);
    }
  }

  characterAttack(index, attacker, target) {

    const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);

    if (!attacker || !target) return

    this.gamePlay.showDamage(index, damage).then(() => {

      target.health -= damage;
      this.gameState.points += damage;

      if (target.health <= 0) {
        this.delectChar(index);
        this.enemysTeam.deleteCharacter(target);
      }
    }).then(() => {
      this.gameState.playerSelected = null;
      this.gamePlay.redrawPositions(this.gameState.charactersList);
    }).then(() => {
      this.gameStatistic();
      this.enemyAttack();
    })
  }

  delectChar(index) {
    this.gameState.charactersList.splice(this.gameState.charactersList.indexOf(this.getCharInCell(index)), 1);
  }

  onCellClick(index) {

    if (this.isPlayers(index)) {
      this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected'));
      this.gamePlay.selectCell(index);
      this.gameState.playerSelected = index;
    }

    if (this.gameState.playerSelected && !this.isPlayerDistance(index, 'attack') && !this.isPlayerDistance(index, 'move') && !this.isEnemy(index) && !this.isPlayers(index)) {
      GamePlay.showError(`Ячейка номер - ${index} неактивная`);
    }

    if (!this.getCharInCell(index) && this.isPlayerDistance(index, 'move')) {
      this.changeCellPlayer(index);
      this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-green'));
    }

    if (this.getSelectedPlayer() && this.isPlayerDistance(index, 'attack') && this.isEnemy(index)) {
      const attacker = this.getSelectedPlayer().character;
      const target = this.getCharInCell(index).character;
      this.characterAttack(index, attacker, target);
      this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected'));

    }
  }

  onCellEnter(index) {

    if (this.isPlayers(index)) {
      this.gamePlay.setCursor(cursors.pointer);
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }


    if (this.isPlayerDistance(index, 'move') && !this.getCharInCell(index)) {

      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    }

    if (this.isPlayerDistance(index, 'attack') && this.isEnemy(index)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
    }

    if (this.gameState.playerSelected && !this.isPlayerDistance(index, 'attack') && !this.isPlayerDistance(index, 'move') && !this.isEnemy(index) && !this.isPlayers(index)) {
      this.gamePlay.setCursor(cursors.notallowed);
    }

    if (this.getPositionsChars().includes(index)) {
      this.gamePlay.showCellTooltip(this.getCharInCell(index).character.infoCharacter, index);
    }
  }

  getSelectedPlayer() {
    return this.gameState.charactersList.find(char => char.position === this.gameState.playerSelected);
  }

  getPlayerPositions() {

    this.playerPosition = [];

    for (let i = 0, j = 1; this.playerPosition.length < this.gamePlay.boardSize * 2; i += this.gamePlay.boardSize, j += this.gamePlay.boardSize) {
      this.playerPosition.push(i, j);
    }

    return this.playerPosition
  }

  getEnemyPositions() {

    this.enemyPosition = [];

    for (let i = this.gamePlay.boardSize - 2, j = this.gamePlay.boardSize - 1; this.enemyPosition.length < this.gamePlay.boardSize * 2; i += this.gamePlay.boardSize, j += this.gamePlay.boardSize) {
      this.enemyPosition.push(i, j);
    }

    return this.enemyPosition
  }

  changeCellPlayer(index) {
    this.getSelectedPlayer(index).position = index;
    this.gamePlay.deselectCell(this.gameState.playerSelected);
    this.gamePlay.redrawPositions(this.gameState.charactersList);
    this.gameState.playerSelected = null;
    this.enemyAttack();
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-red'));
    this.gamePlay.cells.forEach((elem) => elem.classList.remove('selected-green'));
    this.gamePlay.setCursor(cursors.auto);
  }

  checkEnemyPresentInCell(index) {
    return this.enemysTeam.find(char => char.position === index);
  }

  getPositionsChars() {
    return this.gameState.charactersList.map(char => char.position);
  }

  isPlayerDistance(index, move) {
    if (this.getSelectedPlayer()) {
      const distance = getDistance(this.getSelectedPlayer().position, this.getSelectedPlayer().character, this.gamePlay.boardSize, move);
      return distance.includes(index);
    }
  }


  addCharactersPosition(team, positions) {
    const allPositions = [...positions];

    for (const char of team.characters) {
      const indexRandom = getRandomIndex(allPositions);
      this.gameState.charactersList.push(new PositionedCharacter(char, indexRandom));
      allPositions.splice(allPositions.indexOf(indexRandom), 1);
    }
  }

  addCharacterPosition(player, positions) {
    const allPositions = [...positions];
    const indexRandom = getRandomIndex(allPositions);
    this.gameState.charactersList.push(new PositionedCharacter(player, indexRandom));
    allPositions.splice(allPositions.indexOf(indexRandom), 1);
  }

  getCharInCell(index) {
    return this.gameState.charactersList.find(char => char.position === index);
  }

  isPlayers(index) {
    if (this.getCharInCell(index)) {
      const player = this.getCharInCell(index);
      return this.players.some(char => player.character instanceof char);
    }
    return false
  }

  isEnemy(index) {
    if (this.getCharInCell(index)) {
      const enemy = this.getCharInCell(index);
      return this.enemys.some(char => enemy.character instanceof char);
    }
    return false
  }

  startingNewGame() {
    this.stateService.save(GameState.from({
      charactersList: [...this.gameState.charactersList],
      playerSelected: this.gameState.playerSelected,
      level: this.gameState.level,
      points: this.gameState.points,
      statistic: [...this.gameState.statistic]
    }));
    this.init();
    const load = this.stateService.load();

    this.gameState.level = 1;
    this.gameState.playerSelected = null;
    this.gameState.points = 0;
    this.gameState.statistic = load.statistic;
    console.log(this.gameState.statistic);
    console.log(load);

  }

  savingGame() {
    this.stateService.save(GameState.from(this.gameState));
    if (!localStorage.getItem('state')) {
      GamePlay.showError('Игра не сохранена(')
    }
    GamePlay.showMessage('Игра успешно сохранена)')
  }

  loadingSaveGame() {
    const load = this.stateService.load();

    if (!load) {
      GamePlay.showMessage('Нет сохранения(');
      return
    }

    this.gamePlay.drawUi(themes[Object.keys(themes)[load.level - 1]]);
    this.gameState.level = load.level;
    this.gameState.points = load.points;
    this.gameState.statistic = load.statistic;
    this.playersTeam = new Team();
    this.enemysTeam = new Team();
    this.gameState.playerSelected = load.playerSelected;
    this.gameState.charactersList = [];

    for (const char of load.charactersList) {
      let obj;

      if (char.character.type === 'bowman') {
        obj = new Bowman(char.character.level);
        this.playersTeam.add(obj);
      }

      else if (char.character.type === 'swordsman') {
        obj = new Swordsman(char.character.level);
        this.playersTeam.add(obj);
      }

      else if (char.character.type === 'magician') {
        obj = new Magician(char.character.level);
        this.playersTeam.add(obj);
      }

      else if (char.character.type === 'vampire') {
        obj = new Vampire(char.character.level);
        this.enemysTeam.add(obj);
      }

      else if (char.character.type === 'undead') {
        obj = new Undead(char.character.level);
        this.enemysTeam.add(obj);
      }

      else if (char.character.type === 'daemon') {
        obj = new Daemon(char.character.level);
        this.enemysTeam.add(obj);
      }

      obj.health = char.character.health;

      this.gameState.charactersList.push(new PositionedCharacter(obj, char.position));
    }

    this.gamePlay.redrawPositions(this.gameState.charactersList);
  }
}