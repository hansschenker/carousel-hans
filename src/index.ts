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

// dom elements: snake parts
const snakeParts = Array.from(document.getElementsByClassName("snake"));
let root = document.documentElement;

interface Direction {
  axis: string;
  axisTo: number;
}
interface Position {
  x: number;
  y: number;
}

type MoveArrow = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

interface MoveArrowDirection {
  arrowDirection: MoveArrow;
}
// move info
interface MoveInfo {
  // position: Position;
  direction: Direction;
  // distance: number;
}

var moveInfos: { [key: string]: MoveInfo } = {
  ArrowLeft: {
    // position: { x: 200, y: 200 },
    // distance: 20,
    direction: { axis: "x", axisTo: -1 },
  },
  ArrowRight: {
    // position: { x: 200, y: 200 },
    // distance: 20,
    direction: { axis: "x", axisTo: -1 },
  },
  ArrowUp: {
    // position: { x: 200, y: 200 },
    // distance: 20,
    direction: { axis: "y", axisTo: -1 },
  },
  ArrowDown: {
    // position: { x: 200, y: 200 },
    // distance: 20,
    direction: { axis: "y", axisTo: 1 },
  },
};

// snake position state
interface SnakeState {
  position: Position;
  distance: number;
  direction: Direction;
}
const initialState: SnakeState = {
  position: { x: 200, y: 200 },
  distance: 20,
  direction: { axis: "x", axisTo: -1 },
};

console.clear();
console.log("boxes:", snakeParts);
// translate3d(tx, ty, tz)

const arrowKeys$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
  filter(
    (event: KeyboardEvent) =>
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown"
  ),
  map((event) => event.key),
  // distinctUntilChanged((a, b) => a === b),
  map((arrow: string) => moveInfos[arrow])

  //tap((v: SnakeState) => moveSnake(v))
);
const timer$ = timer(0, 1000)
  .pipe(
    withLatestFrom((v) => arrowKeys$),
    scan(
      (state) => ({
        ...state,
        axis: state.direction.axis,
        direction: state.direction,
        position: {
          x: state.position.x + state.distance,
          y: state.position.y + state.distance,
        },
        distance: state.distance + state.distance,
      }),
      initialState
    ),
    tap((v: SnakeState) => {
      console.log("snakeState-position:", v.position);
    }),
    tap((v) => moveSnake(v)),
    take(5)
  )
  .subscribe();

const moveSnake = (snakeState: SnakeState) => {
  let axis = snakeState.direction.axis;
  let moveAxis = `--snake-move-${axis}`;
  let movePositionx = `${snakeState.position.x}px`;
  let movePositiony = `${snakeState.position.y}px`;
  let moveValue = axis === "x" ? movePositionx : movePositiony;
  console.log("css-setProperty:", moveAxis, moveValue);
  root.style.setProperty(moveAxis, moveValue);
};

// const moves$ = timer$
//   .pipe(
//     (n) => arrowKeys$,
//     tap((state) => moveSnake(state)),
//     take(5)
//   )
//   .subscribe((v) => console.log("moves$", v));
