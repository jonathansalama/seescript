declare module "valoo" {
  namespace valoo {
    type Disposer = () => void;
    interface Observable<T> {
      (): T;
      (value: T): void;
      on(fn: (value: T) => void): Disposer;
    }
  }

  function valoo<T = any>(value: T): valoo.Observable<T>;
  export = valoo;
}