import {characterGenerator, generateTeam} from '../generators';
import Bowman from "../characters/playerClasses/Bowman";
import Magician from "../characters/playerClasses/Magician";
import Swordsman from "../characters/playerClasses/Swordsman";

const players = [Bowman, Magician, Swordsman];

test('Генератор characterGenerator должен выдавать беконечно новых персонажей из списка', () => {
    expect(characterGenerator(players, 10).next().done).toBeFalsy();
});

test('Генератор characterGenerator должен выдавать перосонажей только из списка', () => {
    const player = characterGenerator(players, 10).next().value;
    const res = players.map(Instance => new Instance(10).type).some(elem => elem === player.type);
    expect(res).toBeTruthy();
});

test('Функция generateTeam должна создавать в переданном количестве персонажей', () => {
    const team = generateTeam(players, 10, 5);

    expect(team.length).toBe(5);
});

test('Функция generateTeam должна создавать персонажей в переданном диапазоне уровней', () => {
    const team = generateTeam(players, 5, 5);

    expect(team.every(char => char.level >= 1 && char.level <= 5)).toBeTruthy();
})