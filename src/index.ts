import "./styles.css";
// rxjs
import {
  take,
  takeUntil,
  takeLast,
  tap,
  filter,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  withLatestFrom,
  map,
  switchMap,
  mapTo,
  scan,
} from "rxjs/operators";
import { fromEvent, timer, merge, of } from "rxjs";

// dom elements
const boxes = Array.from(document.getElementsByClassName("box"));
let root = document.documentElement;

interface Direction {
  axis: string;
  moveto: number;
}
interface Position {
  x: number;
  y: number;
}
// move directions
interface MoveInfo {
  position: Position;
  direction: Direction;
  distance: number;
  speed?: number;
  collision?: boolean;
}

type Move = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

var moveInfos: { [key: string]: MoveInfo } = {
  ArrowLeft: {
    position: { x: 200, y: 200 },
    distance: 20,
    direction: { axis: "x", moveto: -1 },
  },
  ArrowRight: {
    position: { x: 200, y: 200 },
    distance: 20,
    direction: { axis: "x", moveto: -1 },
  },
  ArrowUp: {
    position: { x: 200, y: 200 },
    distance: 20,
    direction: { axis: "y", moveto: -1 },
  },
  ArrowDown: {
    position: { x: 200, y: 200 },
    distance: 20,
    direction: { axis: "y", moveto: 1 },
  },
};

// snake position state
interface SnakeState {
  move: MoveInfo;
}
const initialState: SnakeState = {
  move: {
    position: { x: 200, y: 200 },
    distance: 20,
    direction: { axis: "x", moveto: -1 },
    collision: false,
    speed: 500,
  },
};

console.clear();
console.log("boxes:", boxes);
// translate3d(tx, ty, tz)

const timer$ = timer(0, 1000);

const arrowKeys$ = fromEvent<KeyboardEvent>(document, "keydown")
  .pipe(
    filter(
      (event: KeyboardEvent) =>
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
    ),
    map((event) => event.key),
    distinctUntilChanged((a, b) => a === b),
    map((code: string) => moveInfos[code]),
    scan(
      (state, move) => ({
        ...state,
        direction: move.direction,
        distance: move.distance,
      }),
      initialState
    ),
    tap((v: SnakeState) => moveSnake(v)),
    tap((v: SnakeState) => console.log("snakeState:", v))
  )
  .subscribe();

const startx = 200;
const starty = 200;

const moveSnake = (snakeState: SnakeState) => {
  let axis = snakeState.move.direction.axis;
  let moveAxis = `--snake-move-${axis}`;
  let movePositionx = `${snakeState.move.position.x}px`;
  let movePositiony = `${snakeState.move.position.y}px`;
  let moveValue = axis === "x" ? movePositionx : movePositiony;
  console.log("css-setProperty:", moveAxis, moveValue);
  root.style.setProperty(moveAxis, moveValue);
};

// const moves$ = timer$.pipe(
//   take(5),
//   tap(() => moveSnake()),
//   tap((v) => console.log("timer$:", v))
// );
//.subscribe();
