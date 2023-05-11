import { beforeEach, describe, expect, it } from "vitest";
import { interpret, InterpreterFrom } from "xstate";
import {
	GameMachine,
	GameModel,
	makeGame,
} from "../../src/machine/GameMachine";
import { GameStates, PlayerColor } from "../../src/types";
import { canDropTokenGuard } from "../../src/machine/guards";

//TESTS UTILITAIRES
describe("machine/GameMachine", () => {
	describe("join", () => {
		let machine: InterpreterFrom<typeof GameMachine>;

		beforeEach(() => {
			machine = interpret(GameMachine).start();
		});

		it("should not let a player join a game twice", () => {
			expect(machine.send(GameModel.events.join("1", "1")).changed).toBe(true);
			expect(machine.state.context.players).toHaveLength(1); // Verify if there is one player when one player join

			expect(machine.send(GameModel.events.join("2", "2")).changed).toBe(true);
			expect(machine.state.context.players).toHaveLength(2); // Verify if there is two players if two players join
		});
	});

	//Simulate the drop of a token
	describe("dropToken", () => {
		let machine: InterpreterFrom<typeof GameMachine>;

		beforeEach(() => {
			machine = makeGame(GameStates.PLAY, {
				players: [
					{
						id: "1",
						name: "1",
						color: PlayerColor.BLUE,
					},
					{
						id: "2",
						name: "2",
						color: PlayerColor.GREEN,
					},
				],
				currentPlayer: "1",
				grid: [
					["E", "E", "E", "E", "E", "E", "B"],
					["E", "E", "E", "E", "E", "B", "G"],
					["E", "E", "E", "E", "E", "B", "B"],
					["E", "E", "E", "E", "E", "B", "G"],
					["E", "E", "E", "E", "E", "G", "B"],
					["E", "E", "E", "E", "E", "G", "G"],
				],
			});
		});

		it("should let me drop a token", () => {
			expect(machine.send(GameModel.events.dropToken("1", 0)).changed).toBe(
				true
			); // Drop a token at x=0

			expect(machine.state.context.grid[5][0]).toBe(PlayerColor.BLUE); // At this position (y=0), the grid should be "B"
			expect(machine.state.value).toBe(GameStates.PLAY); // The game should still be in play
			expect(machine.state.context.currentPlayer).toBe("2"); // The player should be player "2" now
		});

		it("should not let me drop a token on filled columns", () => {
			expect(machine.send(GameModel.events.dropToken("1", 6)).changed).toBe(
				false
			); // Drop a token at x=6, where the column is filled
		});

		it("should make me win", () => {
			expect(machine.send(GameModel.events.dropToken("1", 5)).changed).toBe(
				true
			); // Drop a token at x=5, where the column have 3 tokens BLUE

			expect(machine.state.value).toBe(GameStates.VICTORY);
			expect(machine.state.context.winningPositions).toHaveLength(4);
		});

		it("should handle draw", () => {
			machine = makeGame(GameStates.PLAY, {
				...machine.state.context,
				grid: [
					["E", "G", "G", "G", "G", "G", "G"],
					["G", "G", "G", "G", "G", "G", "G"],
					["G", "G", "G", "G", "G", "G", "G"],
					["G", "G", "G", "G", "G", "G", "G"],
					["G", "G", "G", "G", "G", "G", "G"],
					["G", "G", "G", "G", "G", "G", "G"],
				],
			});

			expect(machine.send(GameModel.events.dropToken("1", 0)).changed).toBe(
				true
			);

			expect(machine.state.value).toBe(GameStates.DRAW);
		});
	});
});
