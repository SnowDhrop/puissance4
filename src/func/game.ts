import { GameContext, GridState, Player, PlayerColor } from "../types";

export function freePositionY(grid: GridState, x: number): number {
	for (let y = grid.length - 1; y >= 0; y--) {
		if (grid[y][x] === "E") {
			return y;
		}
	}

	return -1;
}

export function winningPositions(
	grid: GridState,
	color: PlayerColor,
	x: number,
	size: number
) {
	const directions = [
		[1, 0],
		[0, 1],
		[1, 1],
		[1, -1],
	];

	const position = {
		y: freePositionY(grid, x),
		x: x,
	};

	for (const direction of directions) {
		const items = [position];

		for (const forward of [1, -1]) {
			for (let i = 1; i < size; i++) {
				const x = position.x + direction[0] * i * forward;
				const y = position.y + direction[1] * i * forward;

				if (grid?.[y]?.[x] !== color) {
					break;
				}

				items.push({ x, y });
			}

			if (items.length >= size) {
				return items;
			}
		}
	}

	return [];
}

export function currentPlayer(context: GameContext): Player {
	const player = context.players.find((p) => p.id === context.currentPlayer);

	if (player === undefined) {
		throw new Error("Impossible to find the current player");
	}

	return player;
}

export function countEmptyCells(grid: GridState): number {
	let count = 0;

	for (const row of grid) {
		for (const cell of row) {
			if (cell === "E") {
				count++;
			}
		}
	}

	return count;
}
