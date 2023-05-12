import { discColorClass } from "../../func/color";
import { PlayerColor } from "../../types";

type GameInfoProps = {
	color: PlayerColor;
	name: string;
};

export function GameInfo({ color, name }: GameInfoProps) {
	return (
		<div>
			<h2 className='flex' style={{ gap: ".6rem" }}>
				Your turn {name} <div className={discColorClass(color)}></div>to play
			</h2>
		</div>
	);
}
