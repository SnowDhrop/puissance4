import { InterpreterFrom } from "xstate";
import { GameMachine } from "../../machine/GameMachine";
import { ConnectionRepository } from "../repositories/ConnectionRepository";
import { SocketStream } from "@fastify/websocket";

// A chaque fois qu'une nouvelle opération a lieu, les autres joueurs sont informés
export function publishMachineToPlayers(
	machine: InterpreterFrom<typeof GameMachine>["state"],
	connections: ConnectionRepository,
	gameId: string
) {
	for (const player of machine.context.players) {
		const connection = connections.find(player.id, gameId);

		if (connection) {
			publishMachine(machine, connection);
		}
	}
}

//Lorsqu'un joueur rejoint la partie, il ne déclenche pas forcément un changement d'état
export function publishMachine(
	machine: InterpreterFrom<typeof GameMachine>["state"],
	connection: SocketStream
) {
	connection.socket.send(
		JSON.stringify({
			type: "gameUpdate",
			state: machine.value,
			context: machine.context,
		})
	);
}
