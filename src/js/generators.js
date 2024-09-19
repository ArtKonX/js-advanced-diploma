/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const randomLevel = Math.floor(Math.random() * maxLevel + 1);
  const randomCharecterIndex = Math.floor(Math.random() * allowedTypes.length);
  const CharacterTeam = allowedTypes[randomCharecterIndex];

  yield new CharacterTeam(randomLevel);
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const arrayTeam = []

  for (let i = 0; i < characterCount; i++) {
    arrayTeam.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }

  return arrayTeam;
}