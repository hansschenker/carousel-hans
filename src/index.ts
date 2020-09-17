import "./styles.css";
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
// rxjs
import { fromEvent, timer, merge, of } from "rxjs";

const boxes = Array.from(document.getElementsByClassName("box"));
let root = document.documentElement;

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
    tap((v) => console.log("arrow-direction:", v))
  )
  .subscribe();

// const lastKey$ = timer$
//   .pipe(withLatestFrom(arrowKeys$))
//   .subscribe((k) => console.log("direction:", k));
// tap((event: KeyboardEvent) => console.log("event:", event.key)),
// filter((event: KeyboardEvent) => event.key === "ArrowLeft")
const startX = 200;
const startY = 200;

const moveSnake = () => {
  let n = 1;
  root.style.setProperty("--snake-move-x", 0 + "px");
  root.style.setProperty("--snake-move-y", 200 + n * 20 * -1 * 20 + "px");
  n++;
};

const moves$ = timer$.pipe(
  take(5),
  tap(() => moveSnake()),
  tap((v) => console.log("timer$:", v))
);
//.subscribe();
