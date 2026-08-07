type EventMap = Record<string, any[]>

type Listener<Args extends any[] = any[]> = (...args: Args) => void;

export class EventEmitter<Events extends EventMap = EventMap> {
  private readonly events = new Map<keyof Events, Listener[]>();

  public on<E extends keyof Events>(event: E, listener: Listener<Events[E]>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener as Listener);
    return () => this.removeListener(event, listener);
  }

  public removeListener<E extends keyof Events>(event: E, listener: Listener<Events[E]>): void {
    const listeners = this.events.get(event);
    if (!listeners) return;

    const idx = listeners.indexOf(listener as Listener);
    if (idx > -1) {
      listeners.splice(idx, 1);
      if (listeners.length === 0) {
        this.events.delete(event);
      }
    }
  }

  public removeAllListeners(): void {
    this.events.clear();
  }

  public emit<E extends keyof Events>(event: E, ...args: Events[E]): void {
    const listeners = this.events.get(event);
    if (!listeners) return;

    [...listeners].forEach(listener => {
      try {
        listener.apply(this, args);
      } catch (error) {
        console.error(`Error in event listener "${String(event)}":`, error);
      }
    });
  }

  public once<E extends keyof Events>(event: E, listener: Listener<Events[E]>): () => void {
    const onceListener = (...args: Events[E]) => {
      this.removeListener(event, onceListener);
      listener.apply(this, args);
    };
    return this.on(event, onceListener);
  }
}

export default EventEmitter