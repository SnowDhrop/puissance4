import { prevent } from "../../func/dom";
import { PlayerColor } from "../../types";
import { ColorSelector } from "../components/ColorSelector";
import { useGame } from "../hooks/useGame";

export function LobbyScreen() {
	const { send, context, can } = useGame();

	const colors = [PlayerColor.BLUE, PlayerColor.GREEN];

	const chooseColor = (color: PlayerColor) =>
		send({
			type: "chooseColor",
			color,
		});

	const startGame = () => send({ type: "start" });

	const canStart = can({ type: "start" });

	return (
		<div>
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

			<p style={{ marginTop: "50px", fontWeight: "bold" }}>
				To play with another personn, just send them the url of the page
			</p>
		</div>
	);
}
