import Team from "../Team";

import Magician from "../characters/playerClasses/Magician";
import Swordsman from "../characters/playerClasses/Swordsman";

describe('Тестирование класса Team', () => {

    test('Исключение в методе add если уже есть такой объект', () => {
        const team = new Team();
        const magician = new Magician(1);
        team.add(magician);

        expect(() => team.add(magician)).toThrow(new Error(`Этот персонаж ${magician.type} уже существует`));
    });

    test('Тестирование метода add на добавление объекта', () => {
        const team = new Team();
        team.add(new Magician(1));

        expect(team.characters.size).toBe(1);
    });

    test('Тестирование метода addAll на добавление сразу нескольких обьектов', () => {
        const team = new Team();
        team.addAll([new Magician(1), new Swordsman(1)]);

        expect(team.characters.size).toBe(2);
    });

    test('Тестирование метода clearAllSet на удаление всех объектов в множестве', () => {
        const team = new Team();
        team.addAll([new Magician(1), new Swordsman(1)]);
        team.clearAllSet();

        expect(team.characters.size).toBe(0);
    });

    test('Тестирование метода deleteCharacter на удаление объекта в множестве', () => {
        const team = new Team();
        const magician = new Magician(1);
        const swordsman = new Swordsman(1);

        team.addAll([magician, swordsman]);
        team.deleteCharacter(swordsman);

        expect(team.characters.size).toBe(1);
    });
});