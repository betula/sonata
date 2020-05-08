import { Store, propStoreState, set } from "./store";
import { prop } from "./prop";

export const LensComposite = Symbol("LensComposite");
export const LensView = Symbol("LensView");

export const propLensComposite = prop(LensComposite);
export const propLensView = prop(LensView);

type RawLens<S = any, R = any> = [
  (state: S) => R,
  (state: S, value: any) => S
];
type CompositeLens = {
  [LensComposite]: boolean;
}
export type Lens = CompositeLens | string;
export type View = {
  [LensView]: boolean;
}

export function lens(...pieces: (Lens | RawLens)[]): Lens {
  const composite = [] as any;
  for (const piece of pieces as any) {
    if (propLensComposite(piece)) {
      composite.push(...piece);
    } else {
      composite.push(piece);
    }
  }
  propLensComposite(composite, true);
  return composite;
}

export function view(store: Store | View, l: Lens): View {
  let lenses = [] as any;
  if (propLensView(store)) {
    [ store, lenses ] = store as any;
  }
  const v = [ store, lens(...lenses, l) ];
  propLensView(v, true);
  return v as any;
}

function readOne(state: any, lens: RawLens) {
  return Array.isArray(lens)
    ? lens[0](state)
    : state[lens as any];
}

export function read(view: View): any;
export function read(store: Store | View, lens: Lens): any;
export function read(store: any, lens?: any) {
  if (typeof lens === "undefined") {
    if (propLensView(store)) {
      return (read as any)(...store);
    }
    throw new Error("Unsupported agruments");
  }
  [ store, lens ] = view(store, lens) as any;
  let state = propStoreState(store);
  for (const l of lens) {
    state = readOne(state, l);
  }
  return state;
}

function writeOne(state: any, lens: RawLens, value: any) {
  if (Array.isArray(lens)) {
    return lens[1](state, value);
  }
  else {
    return {
      ...state,
      [lens as any]: value
    }
  }
}

export function write(view: View, value: any): void;
export function write(store: Store | View, lens: Lens, value: any): void;
export function write(store: any, lens?: any, value?: any) {
  if (arguments.length === 2) {
    if (propLensView(store)) {
      return (write as any)(...store, lens);
    }
    throw new Error("Unsupported agruments");
  }

  [ store, lens ] = view(store, lens) as any;
  let state = propStoreState(store);
  const queue = [ state ] as any[];
  const last = lens.length - 1;
  for (let i = 0; i <= last; i++) {
    if (i !== last) {
      state = readOne(state, lens[i]);
      queue.push(state);
    }
    else {
      state = writeOne(state, lens[i], value);
      for (let j = i - 1; j >= 0; j--) {
        state = writeOne(queue.pop(), lens[j], state);
      }
    }
  }
  set(store, state);
}