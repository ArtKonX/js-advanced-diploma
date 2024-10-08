/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level = 1, type = 'generic') {

    this.type = type;
    this.level = level;
    this.health = 50;
    this.attack = 0;
    this.defence = 0;

    if (new.target.name === 'Character') throw new Error('Нельзя создавать объекты этого класса через new Character(level)');
  }

  levelUp() {
    this.level += 1;
    this.attack = Math.floor(Math.max(this.attack, this.attack * (80 + this.health) / 100));
    this.defence = Math.floor(Math.max(this.defence, this.defence * (80 + this.health) / 100));
    this.health += 80;
    if (this.health > 100) this.health = 100;
  }

  get infoCharacter() {
    return `\u{1F396}${this.level}\u{2694}${this.attack}\u{1F6E1}${this.defence}\u{2764}${this.health}`;
  }
}
