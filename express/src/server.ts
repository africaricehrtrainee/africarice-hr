// src/server.ts
import config from "../config";
import { ExpressServer } from "./services/express-server";

const PORT = config.port;
const expressServer = new ExpressServer(Number.parseInt(PORT));
expressServer.start();
