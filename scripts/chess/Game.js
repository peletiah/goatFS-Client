let knightPosition = [1, 7];
let observer = null;

function emitChange() {
  // observer is the handleChange-function, 
  // emitChange() sets state to current knightPosition
  observer(knightPosition);
}

export function observe(o) {
  // o is the handleChange-function defined in ./Chess.js, which we wrapped in observe()
  if (observer) {
    throw new Error('Multiple observers not implemented.');
  }

  observer = o;
  emitChange();

  return () => {
    observer = null;
  };
}


export function canMoveKnight(toX, toY) {
  const [x, y] = knightPosition;
  const dx = toX - x;
  const dy = toY - y;

  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}

export function moveKnight(toX, toY) {
  knightPosition = [toX, toY];
  emitChange();
}
