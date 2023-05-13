import { currentPlayer } from "../../func/game";
import { Victory } from "../components/Victory";
import { useGame } from "../hooks/useGame";

export function VictoryScreen() {
	const { context, send } = useGame();

	const player = currentPlayer(context);

	const restart = () => send({ type: "restart" });

	return (
		<div>
			<Victory color={player.color!} name={player.name} onRestart={restart} />
		</div>
	);
}
