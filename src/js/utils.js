/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  const totalBoard = Math.pow(boardSize, 2);

  if (index === 0) {
    return 'top-left'
  } else if (index === boardSize - 1) {
    return 'top-right'
  } else if (index < boardSize) {
    return 'top'
  } else if (index === totalBoard - boardSize) {
    return 'bottom-left'
  } else if (index === totalBoard - 1) {
    return 'bottom-right'
  } else if (index < totalBoard && index > totalBoard - boardSize) {
    return 'bottom'
  } else if ((index + 1) % boardSize === 0 && (index !== boardSize - 1) && (index !== totalBoard - 1)) {
    return 'right'
  } else if (index % boardSize === 0 && (index !== 0) && (index !== totalBoard - boardSize)) {
    return 'left'
  }

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function getDistance(index, character, boardSize, type) {

  let maxDistance = null;

  const listDistance = [];

  let topLeft = index;
  let top = index;
  let topRight = index;
  let right = index;
  let bottomRight = index;
  let bottom = index;
  let bottomLeft = index;
  let left = index;

  if (type === 'move') {
    maxDistance = character?.maxMoveDistance;
  }

  if (type === 'attack') {
    maxDistance = character?.maxAttackDistance;
  }

  for (let i = 0; i < maxDistance; i++) {

    if (topLeft >= boardSize && topLeft % boardSize !== 0 && topLeft !== 8) {
      topLeft -= (boardSize + 1);
      listDistance.push(topLeft)
    }

    if (top >= boardSize) {
      top -= boardSize;
      listDistance.push(top)
    }

    if (topRight >= boardSize && topRight % boardSize !== boardSize - 1) {
      topRight -= boardSize - 1;
      listDistance.push(topRight)
    }

    if (right % boardSize !== boardSize - 1) {
      right += 1;
      listDistance.push(right)
    }

    if (bottomRight <= Math.pow(boardSize, 2) - boardSize && bottomRight % boardSize !== boardSize - 1) {
      bottomRight += boardSize + 1;
      listDistance.push(bottomRight)
    }

    if (bottom <= Math.pow(boardSize, 2) - boardSize) {
      bottom += boardSize;
      listDistance.push(bottom)
    }

    if (bottomLeft <= Math.pow(boardSize, 2) - boardSize && bottomLeft % boardSize !== 0) {
      bottomLeft += boardSize - 1;
      listDistance.push(bottomLeft)
    }

    if (left % boardSize !== 0) {
      left -= 1;
      listDistance.push(left)
    }
  }

  if (type === 'attack') {
    const rowLeft = Math.floor(top / boardSize);
    const rowRight = Math.floor(bottom / boardSize);
    const colTop = (left % boardSize);
    const colBottom = (right & boardSize);

    for (let i = rowLeft; i <= rowRight; i++)  {
      for (let j = colTop; j <= colBottom; j++) {
        listDistance.push(i * boardSize + j);
      }
    }
  }

  return listDistance.filter((elem) => elem >= 0 && elem < (boardSize ** 2));
}

export function getRandomIndex(positions) {
  return positions[Math.floor(Math.random() * positions.length)];
}
