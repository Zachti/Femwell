export class Buffer<T> {
  private _buffer: T[];

  constructor() {
    this._buffer = [];
  }

  add(event: T): void {
    this._buffer.push(event);
  }

  getAll() {
    return this._buffer;
  }

  get size(): number {
    return this._buffer.length;
  }

  get isEmpty(): boolean {
    return this.size === 0;
  }

  reset(): void {
    // clear all events
    this._buffer = [];
  }
}
