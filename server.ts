import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Gear } from "./src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Robot Server is running" });
  });

  // WebSocket Server for Mocking/Relaying if needed
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws) => {
    console.log("Client connected to Mock Robot Server");
    
    let battery = 85;
    let status = "idle";
    let gear = "mid" as Gear;
    let processStep = "";

    const statusInterval = setInterval(() => {
      ws.send(JSON.stringify({
        type: "status",
        battery,
        status,
        gear,
        process_step: processStep
      }));
    }, 1000);

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        // console.log("Received from client:", msg);

        if (msg.type === "enter_front") {
          status = "entering";
          processStep = "scan_arm";
          setTimeout(() => { processStep = "move_under"; }, 2000);
          setTimeout(() => { processStep = "lock_wheel"; }, 4000);
          setTimeout(() => { 
            status = "idle"; 
            processStep = "";
            ws.send(JSON.stringify({ type: "process_done" }));
          }, 6000);
        }

        if (msg.type === "exit_car") {
          status = "exiting";
          processStep = "unlock_wheel";
          setTimeout(() => { processStep = "move_out"; }, 2000);
          setTimeout(() => { 
            status = "idle"; 
            processStep = "";
            ws.send(JSON.stringify({ type: "process_done" }));
          }, 4000);
        }

        if (msg.type === "speed_gear") {
          gear = msg.gear;
        }

        if (msg.type === "emergency_stop") {
          status = "stopped";
          processStep = "EMERGENCY STOPPED";
          setTimeout(() => { status = "idle"; processStep = ""; }, 2500);
        }

      } catch (e) {
        console.error("Failed to parse message", e);
      }
    });

    ws.on("close", () => {
      clearInterval(statusInterval);
      console.log("Client disconnected");
    });
  });

  server.on("upgrade", (request, socket, head) => {
    const pathname = request.url ? new URL(request.url, 'http://localhost').pathname : '';
    console.log(`Upgrade request for: ${pathname}`);
    
    if (pathname === "/ws-mock") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      // Don't destroy if it might be Vite HMR
      if (process.env.NODE_ENV !== "production" && pathname === "/@vite/client") {
        return;
      }
      // socket.destroy(); // Let other handlers or Vite handle it
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Mock Robot WS available at ws://localhost:${PORT}/ws-mock`);
  });
}

startServer();
