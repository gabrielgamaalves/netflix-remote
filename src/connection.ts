import { NavigatorBrowse } from "@navigator/browse.js"

import { type DataConnection, Peer } from "peerjs"

export const id = "5f8a99c6-c4fc-4a3a-94f3-8d2e65900909" /* crypto.randomUUID() */
export const peer = new Peer(id)


peer.on("connection", (conn) => {
  Object.assign(window, {
    nav: new NavigatorBrowse(conn)
  })

  console.log('Connection received from:', conn.peer);

  conn.on("data", (data) => {
    console.log('Received data:', data);
  });

  conn.on("open", () => {
    conn.send("hello!");
  });

  conn.on('error', (err) => {
    console.error('Connection error:', err);
  });
});

peer.on('error', (err) => {
  console.error('Peer error:', err);
});

peer.on('open', (id) => {
  console.log('Peer ready with ID:', "\n" + id);
});