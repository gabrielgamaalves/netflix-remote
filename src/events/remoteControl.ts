import EventEmitter from "@lib/events.js"
import type { DataConnection } from "peerjs"

export const remoteControlEvents = [
  "KEY_UP",
  "KEY_DOWN",
  "KEY_LEFT",
  "KEY_RIGHT",
  "KEY_ENTER"
] as const

export type RemoteControlEventMap = {
  [K in typeof remoteControlEvents[number]]: [];
};

export class RemoteControlEmitter extends EventEmitter<RemoteControlEventMap> {
  private connection: DataConnection

  constructor(connection: DataConnection) {
    super()
    this.connection = connection

    this.connection.on("data", (raw) => {
      const event = raw as keyof RemoteControlEventMap
      super.emit(event)
    })
  }
}