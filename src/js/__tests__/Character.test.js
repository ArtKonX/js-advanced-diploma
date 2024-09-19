import Character from "../Character";

import Daemon from "../characters/enemyClasses/Daemon.js";
import Undead from "../characters/enemyClasses/Undead.js";
import Vampire from "../characters/enemyClasses/Vampire";

import Bowman from "../characters/playerClasses/Bowman";
import Magician from "../characters/playerClasses/Magician";
import Swordsman from "../characters/playerClasses/Swordsman";

test('Исключение при создании объекта класса Character', () => {

    expect(() => new Character(1)).toThrow(new Error('Нельзя создавать объекты этого класса через new Character(level)'));
});

test('Исключение не выбрасывается при создании объектов классов унаследованных от Character', () => {

    expect(() => new Daemon(1)).not.toThrow(new Error('Нельзя создавать объекты этого класса через new Character(level)'));
});

test.each([
    [Daemon, {
        level: 1, attack: 10, defence: 10, health: 50, maxMoveDistance: 1, maxAttackDistance: 4, type: 'daemon'
    }],
    [Undead, {
        level: 1, attack: 40, defence: 10, health: 50, maxMoveDistance: 4, maxAttackDistance: 1, type: 'undead'
    }],
    [Vampire, {
        level: 1, attack: 25, defence: 25, health: 50, maxMoveDistance: 2, maxAttackDistance: 2, type: 'vampire'
    }],
    [Bowman, {
        level: 1, attack: 25, defence: 25, health: 50, maxMoveDistance: 2, maxAttackDistance: 2, type: 'bowman'
    }],
    [Magician, {
        level: 1, attack: 10, defence: 40, health: 50, maxMoveDistance: 1, maxAttackDistance: 4, type: 'magician'
    }],
    [Swordsman, {
        level: 1, attack: 40, defence: 10, health: 50, maxMoveDistance: 4, maxAttackDistance: 1, type: 'swordsman'
    }],
])('Создание экземпляра класса', (Instance, expected) => {
    const char = new Instance(1);
    expect(char).toEqual(expected);
});

test('Проверка геттера infoCharacter', () => {
    const char = new Daemon(1);
    expect(char.infoCharacter).toBe(`\u{1F396}1\u{2694}10\u{1F6E1}10\u{2764}50`);
});

test('Проверка метода levelUp', () => {
    const char = new Daemon(1, 'daemon');
    char.health = 120;
    char.levelUp();
    expect(char.level).toBe(2);
    expect(char.attack).toBe(20);
    expect(char.defence).toBe(20);
    expect(char.health).toBe(100);
});