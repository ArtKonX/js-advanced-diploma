import Character from "../../Character.js";

export default class Swordsman extends Character {
    constructor(level, type = 'swordsman') {
        super(level, type);

        this.attack = 40;
        this.defence = 10;
        this.maxMoveDistance = 4;
        this.maxAttackDistance = 1;

    }
}