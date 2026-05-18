import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "./env.js";

export function createRealtimeServer(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: env.WEB_ORIGIN,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.join("live-feed");

    socket.on("battle:watch", (battleId: string) => {
      socket.join(`battle:${battleId}`);
    });

    socket.on("disconnect", () => {
      socket.leave("live-feed");
    });
  });

  return io;
}
