import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import FastifyWebsocket from "@fastify/websocket";
import { v4 } from "uuid";
import { sign, verify } from "./func/crypto";
import { resolve } from "path";
import { ServerErrors } from "../types";
import { ConnectionRepository } from "./repositories/ConnectionRepository";
import { GameRepository } from "./repositories/GameRepository";
import { GameModel } from "../machine/GameMachine";
import { publishMachine } from "./func/socket";
import { readFileSync } from "fs";
import FastifyView from "@fastify/view";
import ejs from "ejs";

const connections = new ConnectionRepository();
const games = new GameRepository(connections);
let manifest = {};

try {
	const manifestData = readFileSync("./public/assets/manifest.json");
	manifest = JSON.parse(manifestData.toLocaleString());
} catch (e) {}

const fastify = Fastify({ logger: true });

fastify.register(FastifyView, {
	engine: {
		ejs: ejs,
	},
});

//Fichier que doit ouvrir le serveur
fastify.register(FastifyStatic, {
	root: resolve("./public"),
});

fastify.register(FastifyWebsocket);

//Route des sockets
fastify.register(async (f) => {
	f.get("/ws", { websocket: true }, (connection, req) => {
		// Quand l'utilisateur se connecte au websocket, on lui renvoie un tas d'infos
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

		// On vérifie la session utilisateur
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

		const game = games.find(gameId) ?? games.create(gameId); // Cherche si le joueur a déjà un jeu, si non en crée un nouveau
		connections.persist(playerId, gameId, connection); // On mémorise la connexion de l'utilisateur
		game.send(GameModel.events.join(playerId, playerName)); //On envoie un message à la machine disant qu'un joueur vient de rejoindre

		publishMachine(game.state, connection); // Dès qu'un joueur rejoint je lui renvoie la machine

		// Dès que je rejoins un message du client, je les transmets à la machine s'ils sont du type "gameUpdate"
		// @ts-ignore
		connection.socket.on("message", (rawMessage) => {
			const message = JSON.parse(rawMessage.toLocaleString());

			if (message.type === "gameUpdate") {
				game.send(message.event);
			}
		});

		// @ts-ignore
		connection.socket.on("close", () => {
			connections.remove(playerId, gameId);
			game.send(GameModel.events.leave(playerId));
			games.clean(gameId);
		});

		// if (connection !== null && connection.socket !== null) {
		// 	connection.socket!.onmessage((rawMessage: MessageEvent) => {
		// 		const message = JSON.parse(rawMessage.data);

		// 		if (message.type === "gameUpdate") {
		// 			game.send(message.event);
		// 		}
		// 	});

		// 	connection.socket!.onclose(() => {
		// 		connections.remove(playerId, gameId);
		// 		game.send(GameModel.events.leave(playerId));
		// 		games.clean(gameId);
		// 	});
		// } else {
		// 	console.error("Connection or socket is not defined");
		// }
	});
});

fastify.get("/", (_, res) => {
	res.view("/templates/index.ejs", { manifest, env: process.env.NODE_ENV });
});

fastify.post("/api/players", (_, res) => {
	const playerId = v4();

	res.send({
		id: playerId,
		signature: sign(playerId),
	});
});

fastify
	.listen({
		port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8000,
		host: "0.0.0.0",
	})
	.catch((err) => {
		fastify.log.error(err);
		process.exit(1);
	})
	.then(() => {
		fastify.log.info("Server listen on port 8000");
	});
