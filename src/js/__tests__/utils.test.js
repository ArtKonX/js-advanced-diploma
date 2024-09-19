import { calcTileType, calcHealthLevel, getDistance, getRandomIndex } from "../utils";
import Magician from "../characters/playerClasses/Magician";

describe('Тестирование функции calcTileType', () => {
    test('Тест верхнего левого элемента', () => {
        expect(calcTileType(0, 8)).toBe('top-left')
    });

    test('Тест верхнего правого элемента', () => {
        expect(calcTileType(7, 8)).toBe('top-right')
    });

    test('Тест верхнего элемента', () => {
        expect(calcTileType(4, 8)).toBe('top')
    });

    test('Тест нижнего левого элемента', () => {
        expect(calcTileType(56, 8)).toBe('bottom-left')
    });

    test('Тест нижнего правого элемента', () => {
        expect(calcTileType(63, 8)).toBe('bottom-right')
    });

    test('Тест нижнего элемента', () => {
        expect(calcTileType(59, 8)).toBe('bottom')
    });

    test('Тест правого элемента', () => {
        expect(calcTileType(15, 8)).toBe('right')
    });

    test('Тест левого элемента', () => {
        expect(calcTileType(16, 8)).toBe('left')
    });

    test('Тест центрального элемента', () => {
        expect(calcTileType(9, 8)).toBe('center')
    });
});

describe('Тестирование функции calcHealthLevel', () => {
    test('Проверка критического уровня здоровья в функции calcHealthLevel', () => {
        expect(calcHealthLevel(11)).toBe('critical');
    });

    test('Проверка нормального уровня здоровья в функции calcHealthLevel', () => {
        expect(calcHealthLevel(48)).toBe('normal');
    });

    test('Проверка высокого уровня здоровья в функции calcHealthLevel', () => {
        expect(calcHealthLevel(99)).toBe('high');
    });
});

describe('Тестирование функции getDistance на особенности атаки и движения', () => {
    let magician;
    let distanceAttackTrue;
    let distanceMoveTrue;

    beforeEach(() => {
        magician = new Magician(1);
        distanceAttackTrue = [0, 1, 2, 10, 18, 17, 16, 8, 11, 27, 25, 12, 36, 33, 13, 45, 41, 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 25, 26, 27, 28, 29, 30, 31, 32, 32, 33, 34, 35, 36, 37, 38, 39, 40, 40, 41, 42, 43, 44, 45, 46, 47, 48];
        distanceMoveTrue = [0, 1, 2, 10, 18, 17, 16, 8];
    });

    test('Тестирование getDistance на особенности атаки', () => {
        const distanceAttack = getDistance(9, magician, 8, 'attack');
        expect(distanceAttack).toEqual(distanceAttackTrue);
    });

    test('Тестирование getDistance на особенности движения', () => {
        const distanceMove = getDistance(9, magician, 8, 'move');
        expect(distanceMove).toEqual(distanceMoveTrue);
    });

    test('Тестирование getDistance на правильность обработки верхней границы', () => {
        const distanceAttack = getDistance(11, magician, 8, 'attack');
        expect(distanceAttack).toContain(3);
    });

    test('Тестирование getDistance на правильность обработки правого верхнего края', () => {
        const distanceAttack = getDistance(11, magician, 8, 'attack');
        expect(distanceAttack).toContain(4);
    });

    test('Тестирование getDistance на правильность обработки правого края', () => {
        const distanceAttack = getDistance(11, magician, 8, 'attack');
        expect(distanceAttack).toContain(12);
    });

    test('Тестирование getDistance на правильность обработки правого нижнего угла', () => {
        const distanceAttack = getDistance(47, magician, 8, 'attack');
        expect(distanceAttack).toContain(48);
    });

    test('Тестирование getDistance на правильность обработки нижней границы', () => {
        const distanceAttack = getDistance(40, magician, 8, 'attack');
        expect(distanceAttack).toContain(48);
    });

    test('Тестирование getDistance на правильность обработки левого нижнего угла', () => {
        const distanceAttack = getDistance(11, magician, 8, 'attack');
        expect(distanceAttack).toContain(18);
    });

    test('Тестирование getDistance на правильность обработки левого края', () => {
        const distanceAttack = getDistance(11, magician, 8, 'attack');
        expect(distanceAttack).toContain(10);
    });

    test('Тестирование getDistance на правильность обработки левого верхнего угла', () => {
        const distanceAttack = getDistance(11, magician, 8, 'attack');
        expect(distanceAttack).toContain(2);
    });
});

describe('Тестирование функции getRandomIndex', () => {

    test('Проверяет случайный индекс', () => {
        const positions = [1, 2, 3];
        const randomIndex = getRandomIndex(positions);
        expect(positions).toContain(randomIndex);
    });
});