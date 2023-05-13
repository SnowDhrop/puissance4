// import { NameSelector } from "./components/NameSelector";
import "./index.css";
// import { ColorSelector } from "./components/ColorSelector";
// import { PlayerColor } from "../types";
// import { Grid } from "./components/Grid";
// import { GameInfo } from "./components/GameInfo";
// import { Victory } from "./components/Victory";
import { useGame } from "./hooks/useGame";
import { GameStates } from "../types";
import { LobbyScreen } from "./screens/LobbyScreen";
import { PlayScreen } from "./screens/PlayScreen";
import { Grid } from "./components/Grid";
import { currentPlayer } from "../func/game";
import { VictoryScreen } from "./screens/VictoryScreen";
import { DrawScreen } from "./screens/DrawScreen";

function App() {
	const { state, context, send } = useGame();

	const canDrop = state === GameStates.PLAY;

	const player = canDrop ? currentPlayer(context) : undefined;

	//prettier-ignore
	const dropToken = canDrop
		? (x: number) => {
				send({ type: "dropToken", x: x })
		} : undefined;

	return (
		<div className='container'>
			{state === GameStates.LOBBY && <LobbyScreen />}
			{state === GameStates.PLAY && <PlayScreen />}
			{state === GameStates.VICTORY && <VictoryScreen />}
			{state === GameStates.DRAW && <DrawScreen />}

			<Grid
				grid={context.grid}
				onDrop={dropToken}
				color={player?.color}
				winningPositions={context.winningPositions}
			/>
		</div>
	);
}

export default App;
