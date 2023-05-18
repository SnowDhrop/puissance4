// import { NameSelector } from "./components/NameSelector";
import "./index.css";
// import { ColorSelector } from "./components/ColorSelector";
// import { PlayerColor } from "../types";
// import { Grid } from "./components/Grid";
// import { GameInfo } from "./components/GameInfo";
// import { Victory } from "./components/Victory";
import { useGame } from "./hooks/useGame";
import { GameStates, ServerErrors } from "../types";
import { LobbyScreen } from "./screens/LobbyScreen";
import { PlayScreen } from "./screens/PlayScreen";
import { Grid } from "./components/Grid";
import { currentPlayer } from "../func/game";
import { VictoryScreen } from "./screens/VictoryScreen";
import { DrawScreen } from "./screens/DrawScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { useEffect } from "react";
import { getSession, logout } from "./func/session";

function App() {
	const { state, context, send, playerId } = useGame();

	const canDrop = state === GameStates.PLAY;

	const player = canDrop ? currentPlayer(context) : undefined;

	useEffect(() => {
		if (playerId) {
			const searchParams = new URLSearchParams({
				id: playerId,
				signature: getSession()!.signature!,
				name: getSession()!.name!,
				gameId: "test",
			});

			const socket = new WebSocket(
				`${window.location.protocol.replace("http", "ws")}//${
					window.location.host
				}/ws?${searchParams.toString()}`
			);

			socket.addEventListener("message", (event) => {
				const message = JSON.parse(event.data);

				if (
					message.type === "error" &&
					message.code === ServerErrors.AuthError
				) {
					logout();
				}
			});
		}
	}, [playerId]);

	if (!playerId) {
		return (
			<div className='container'>
				<LoginScreen />
			</div>
		);
	}

	//prettier-ignore
	const dropToken = canDrop
		? (x: number) => {
				send({ type: "dropToken", x: x })
		} : undefined;

	return (
		<div className='container'>
			Player: {playerId} {state === GameStates.LOBBY && <LobbyScreen />}
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
