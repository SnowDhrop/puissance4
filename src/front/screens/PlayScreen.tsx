import { currentPlayer } from "../../func/game";
import { GameInfo } from "../components/GameInfo";
import { useGame } from "../hooks/useGame";

// type PlayScreenProps = {};

export function PlayScreen() {
	const { context } = useGame();

	const player = currentPlayer(context)!;

	return (
		<div>
			<GameInfo color={player.color!} name={player.name} />
		</div>
	);
}
