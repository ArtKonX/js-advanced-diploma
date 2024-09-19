import GameStateService from "../GameStateService";
import GamePlay from "../GamePlay";
import GameController from "../GameController";

jest.mock('../GameState');

describe('Тестирование метода load класса GameStateService', () => {
    let storageMock;
    let gameStateService;

    beforeEach(() => {
        storageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
        };
        gameStateService = new GameStateService(storageMock);
    });

    test('Тестирование успешной загрузки метода load', () => {
        const state = {
            charactersList: [],
            playerSelected: null,
            level: 1,
            points: 0,
            statistic: []
        };

        storageMock.getItem.mockReturnValue(JSON.stringify(state));
        gameStateService.save(JSON.stringify(state))

        const loadedState = gameStateService.load();

        expect(loadedState).toEqual(state);
    });

    test('Тестирование ошибки загрузки метода load', () => {
        const gameStateService = new GameStateService(null);

        expect(() => gameStateService.load()).toThrow(new Error('Invalid state'));
    });

    test('Вывод сообщения через GamePlay при неуспешной загрузке метода load', () => {
        storageMock.getItem.mockReturnValue(null);
        GamePlay.showMessage = jest.fn();

        const gameController = new GameController(new GamePlay(), gameStateService);
        gameController.loadingSaveGame();

        expect(GamePlay.showMessage).toHaveBeenCalledWith('Нет сохранения(')
    })
});
