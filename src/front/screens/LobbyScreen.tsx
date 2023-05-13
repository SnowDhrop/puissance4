import { prevent } from "../../func/dom";
import { PlayerColor } from "../../types";
import { ColorSelector } from "../components/ColorSelector";
import { NameSelector } from "../components/NameSelector";
import { useGame } from "../hooks/useGame";

// type LobbyScreenProps = {};

export function LobbyScreen() {
	const { send, context, can } = useGame();

	const colors = [PlayerColor.BLUE, PlayerColor.GREEN];

	const joinGame = (name: string) =>
		send({ type: "join", name: name, playerId: name });

	const chooseColor = (color: PlayerColor) =>
		send({
			type: "chooseColor",
			color,
			playerId: color === PlayerColor.BLUE ? "Pif" : "Paf",
		});

	const startGame = () => send({ type: "start" });

	const canStart = can({ type: "start" });

	return (
		<div>
			<NameSelector onSelect={joinGame} />

			<ColorSelector
				onSelect={chooseColor}
				players={context.players}
				colors={colors}
			/>

			<p>
				<button
					className='button'
					onClick={prevent(startGame)}
					disabled={!canStart}
				>
					Play
				</button>
			</p>
		</div>
	);
}
