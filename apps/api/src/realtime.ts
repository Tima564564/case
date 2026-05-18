import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "./env.js";

export function createRealtimeServer(server: HttpServer) {
  let onlineCount = 0;
  const io = new Server(server, { cors: { origin: env.WEB_ORIGIN, credentials: true } });

  io.on("connection", (socket) => {
    onlineCount += 1;
    socket.join("live-feed");
    io.emit("presence:online", { online: onlineCount });

    socket.on("battle:watch", (battleId: string) => socket.join(`battle:${battleId}`));

    socket.on("disconnect", () => {
      onlineCount = Math.max(0, onlineCount - 1);
      socket.leave("live-feed");
      io.emit("presence:online", { online: onlineCount });
    });
  });

  return io;
}
