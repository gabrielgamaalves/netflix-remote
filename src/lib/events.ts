
type Listener = (...args: any[]) => void;

export class EventEmitter {
  private readonly events = new Map<string, Listener[]>();

  public on(event: string, listener: Listener): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
    return () => this.removeListener(event, listener);
  }

  public removeListener(event: string, listener: Listener): void {
    const listeners = this.events.get(event);
    if (!listeners) return;

    const idx = listeners.indexOf(listener);
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

  public emit(event: string, ...args: any[]): void {
    const listeners = this.events.get(event);
    if (!listeners) return;

    [...listeners].forEach(listener => {
      try {
        listener.apply(this, args);
      } catch (error) {
        console.error(`Erro no listener do evento "${event}":`, error);
      }
    });
  }

  public once(event: string, listener: Listener): () => void {
    const onceListener = (...args: any[]) => {
      this.removeListener(event, onceListener);
      listener.apply(this, args);
    };
    return this.on(event, onceListener);
  }
}

export default EventEmitter