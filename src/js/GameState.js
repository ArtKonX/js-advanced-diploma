export default class GameState {
  constructor() {
    this.charactersList = [];
    this.playerSelected = null;
    this.level = 1;
    this.points = 0;
    this.statistic = [];
  }

  static from(object) {

    if (typeof object === 'object') return object;

    return null;
  }
}
