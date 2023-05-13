import { Draw } from "../components/Draw";
import { useGame } from "../hooks/useGame";

export function DrawScreen() {
	const { send } = useGame();

	const restart = () => send({ type: "restart" });

	return (
		<div>
			<Draw onRestart={restart} />
		</div>
	);
}
