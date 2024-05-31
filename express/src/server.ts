// src/server.ts
import { ExpressServer } from "./services/express-server";

const PORT = 4000;
const expressServer = new ExpressServer(PORT);
expressServer.start();
