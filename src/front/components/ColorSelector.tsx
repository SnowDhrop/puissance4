import { discColorClass } from "../../func/color";
import { Player, PlayerColor } from "../../types";

type ColorSelectorProps = {
	onSelect: (color: PlayerColor) => void;
	players: Player[];
	colors: PlayerColor[];
};

export function ColorSelector({
	onSelect,
	players,
	colors,
}: ColorSelectorProps) {
	return (
		<>
			<div className='players'>
				{players.map((player) => (
					<div className='player' key={player.id}>
						{player.name}{" "}
						{player.color && (
							<div className={discColorClass(player.color)} key={player.id} />
						)}
					</div>
				))}
			</div>

			<h3>Choose a color</h3>
			<div className='selector'>
				{colors.map((color) => (
					<button
						className={discColorClass(color)}
						key={color}
						onClick={() => onSelect(color)}
					></button>
				))}
			</div>
		</>
	);
}
