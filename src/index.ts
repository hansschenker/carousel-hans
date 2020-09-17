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
} from "rxjs/operators";
import { fromEvent, timer, merge, of } from "rxjs";

// dom elements
const boxes = Array.from(document.getElementsByClassName("box"));
let root = document.documentElement;

// move infos
interface MoveInfo {
  axis: string;
  direction: number;
}

type Move = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

var moveInfos: { [key: string]: MoveInfo } = {
  ArrowLeft: { axis: "x", direction: 1 },
  ArrowRight: { axis: "x", direction: -1 },
  ArrowUp: { axis: "y", direction: -1 },
  ArrowDown: { axis: "y", direction: 1 },
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
    tap((v) => moveSnake),
    tap((v) => console.log("arrow-direction:", v))
  )
  .subscribe();

const startx = 200;
const starty = 200;

const moveSnake = (moveInfo: MoveInfo) => {
  let moveStep = 20;
  let i = 1;
  let propValue = `--snake-move-${moveInfo.axis}`;
  root.style.setProperty(propValue, startx + i * moveStep + "px");
  i++;
};

// const moves$ = timer$.pipe(
//   take(5),
//   tap(() => moveSnake()),
//   tap((v) => console.log("timer$:", v))
// );
//.subscribe();
