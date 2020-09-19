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
  mergeMap,
} from "rxjs/operators";
import {
  fromEvent,
  timer,
  merge,
  of,
  combineLatest,
  BehaviorSubject,
  Observable,
  Subject,
} from "rxjs";

// dom elements: snake parts
const snakeParts = Array.from(document.getElementsByClassName("snake"));
let root = document.documentElement;

interface Direction {
  axis: string;
  axisTo: number;
}
const initialDirection = {
  axis: "x",
  axisTo: -1,
};
interface Position {
  x: number;
  y: number;
}

// type MoveArrow = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

// interface MoveArrowDirection {
//   arrowDirection: MoveArrow;
// }
// move info
interface MoveInfo {
  direction: Direction;
}

var moveInfos: { [key: string]: MoveInfo } = {
  ArrowLeft: {
    direction: { axis: "x", axisTo: -1 },
  },
  ArrowRight: {
    direction: { axis: "x", axisTo: 1 },
  },
  ArrowUp: {
    direction: { axis: "y", axisTo: -1 },
  },
  ArrowDown: {
    direction: { axis: "y", axisTo: 1 },
  },
};

// snake position state
interface Snake {
  position: Position;
  distance: number;
  direction: Direction;
}
const initialState: Snake = {
  position: { x: 200, y: 200 },
  distance: 20,
  direction: { axis: "y", axisTo: -1 },
};

let vm$: Observable<Snake>;
const directionState = new Subject<Direction>();

const directionChange$ = directionState.pipe(
  map((direction: Direction) => (vm: Snake) => ({
    ...vm,
    direction: direction,
    position:
      direction.axis === "x"
        ? { x: vm.position.x + 20 * (1 * direction.axisTo), y: vm.position.y }
        : { y: vm.position.y + 20 * (1 * direction.axisTo), x: vm.position.x },
  }))
);

vm$ = merge(directionChange$).pipe(
  scan(
    (oldVm: Snake, reduceVm: (vm: Snake) => Snake) => reduceVm(oldVm),
    initialState
  )
);
vm$.subscribe((v) => console.log("vm$-direction:", v.direction));
vm$.subscribe((v) => console.log("vm$-position:", v.position));

console.clear();
// console.log("boxes:", snakeParts);

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
  // tap((v) => console.log("arrow:", v)),
  map((arrow: string) => moveInfos[arrow]),
  tap((moveInfo) => directionState.next(moveInfo.direction))

  //todo: change the the direction.axis and .axisTo
);
const timer$ = timer(0, 1000);
const moves$ = combineLatest(
  timer$,
  arrowKeys$,
  directionChange$.pipe(
    map((vm) => vm)
    // tap((v) => console.log("directionChange:", v))
  )
)
  .pipe(
    scan(
      (state) => ({
        ...state,
        axis: state.direction.axis,
        direction: state.direction,
        position: {
          x: state.position.x + state.distance,
          y: state.position.y + state.distance,
        },
      }),
      initialState
    ),
    // tap((v: SnakeState) => {
    //   console.log("snakeState-position:", v.position);
    // }),
    tap((v) => moveSnake(v)),
    take(10)
  )
  .subscribe();

const moveSnake = (snakeState: Snake) => {
  let axis = snakeState.direction.axis;
  let moveAxis = `--snake-move-${axis}`;
  let movePositionx = `${
    snakeState.position.x * snakeState.direction.axisTo
  }px`;
  let movePositiony = `${
    snakeState.position.y * snakeState.direction.axisTo
  }px`;
  let moveValue = axis === "x" ? movePositionx : movePositiony;
  console.log("css-setProperty:", moveAxis, moveValue);
  root.style.setProperty(moveAxis, moveValue);

  // console.log("state-direction-to:", snakeState.direction.axisTo);
  // console.log("state-direction-axis:", snakeState.direction.axis);
  // console.log("state-distance:", snakeState.distance);
  // console.log("state-position-x:", snakeState.position.x);
  // console.log("state-position-y:", snakeState.position.y);
};
