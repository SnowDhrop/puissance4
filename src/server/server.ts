import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import { v4 } from "uuid";
import { sign, verify } from "./func/crypto";
import { resolve } from "path";
import fastifyWebsocket from "@fastify/websocket";
import { ServerErrors } from "../types";
import { ConnectionRepository } from "./repositories/ConnectionRepository";

const connections = new ConnectionRepository();

const fastify = Fastify({ logger: true });

//Fichier que doit ouvrir le serveur
fastify.register(FastifyStatic, {
	root: resolve("./public"),
});

fastify.register(fastifyWebsocket);

//Route des sockets
fastify.register(async (f) => {
	f.get("/ws", { websocket: true }, (connection, req) => {
		const query = req.query as Record<string, string>;
		const playerId = query.id ?? "";
		const signature = query.signature ?? "";
		const playerName = query.name || "John Doe";
		const gameId = query.gameId;

		if (!gameId) {
			connection.end();
			f.log.error("No game id");

			return;
		}

		if (!verify(playerId, signature)) {
			f.log.error("Authentication error");
			connection.socket.send(
				JSON.stringify({
					type: "error",
					code: ServerErrors.AuthError,
				})
			);

			return;
		}

		connections.persist(playerId, gameId, connection);

		connection.socket.send(
			JSON.stringify({
				type: "gameUpdate",
			})
		);

		connection.socket.on("message", (message: any) => {
			console.log(message);
		});

		connection.socket.on("close", () => {
			connections.remove(playerId, gameId);
		});
	});
});

fastify.post("/api/players", (req, res) => {
	const playerId = v4();
	const signature = sign(playerId);

	res.send({
		id: playerId,
		signature: sign(playerId),
	});
});

fastify
	.listen({ port: 8000 })
	.catch((err) => {
		fastify.log.error(err);
		process.exit(1);
	})
	.then(() => {
		fastify.log.info("Server listen on port 8000");
	});
