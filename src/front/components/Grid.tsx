import { CSSProperties } from "react";
import { CellState, GridState, PlayerColor, Position } from "../../types";
import { discColorClass } from "../../func/color";
import { prevent } from "../../func/dom";

type GridProps = {
	grid: GridState;
	color?: PlayerColor;
	onDrop: (x: number) => void;
	winningPositions: Position[];
	canDrop: (x: number) => boolean;
};

export function Grid({
	grid,
	color,
	onDrop,
	winningPositions,
	canDrop,
}: GridProps) {
	const cols = grid[0].length;
	const showColumns = color && onDrop;
	const isWinning = (x: number, y: number) =>
		!!winningPositions.find((p) => p.x === x && p.y === y);

	return (
		<div
			className='grid'
			style={{ "--rows": grid.length, "--cols": cols } as CSSProperties}
		>
			{grid.map((row, y) =>
				row.map((c, x) => (
					<Cell
						x={x}
						y={y}
						color={c}
						key={`${x}-${y}`}
						active={isWinning(x, y)}
					/>
				))
			)}

			{showColumns && (
				<div className='columns'>
					{new Array(cols).fill(1).map((_, k) => (
						<Column
							x={k}
							color={color}
							key={k}
							onDrop={onDrop}
							disabled={!canDrop(k)}
						/>
					))}
				</div>
			)}
		</div>
	);
}

type CellProps = {
	x: number;
	y: number;
	color: CellState;
	active: boolean;
};

function Cell({ y, color, active }: CellProps) {
	return (
		<div
			style={{ "--row": y } as CSSProperties}
			className={discColorClass(color) + (active ? " disc-active" : "")}
		/>
	);
}

type ColumnProps = {
	x: number;
	color: PlayerColor;
	onDrop: (x: number) => void;
	disabled?: boolean;
};

function Column({ color, onDrop, x, disabled }: ColumnProps) {
	return (
		<button
			className='column'
			onClick={prevent(() => onDrop(x))}
			disabled={disabled}
		>
			<div className={discColorClass(color)}></div>
		</button>
	);
}
