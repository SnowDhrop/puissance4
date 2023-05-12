import { NameSelector } from "./components/NameSelector";
import "./css/index.css";
import { ColorSelector } from "./components/ColorSelector";
import { PlayerColor } from "../types";
import { Grid } from "./components/Grid";
import { GameInfo } from "./components/GameInfo";
import { Victory } from "./components/Victory";

function App() {
	return (
		<div className='container'>
			<NameSelector onSelect={() => null} />
			<hr />

			<ColorSelector
				onSelect={() => null}
				players={[
					{
						id: "1",
						name: "John",
						color: PlayerColor.BLUE,
					},
					{
						id: "2",
						name: "Marc",
						color: PlayerColor.GREEN,
					},
				]}
				colors={[PlayerColor.BLUE, PlayerColor.GREEN]}
			/>
			<hr />

			<GameInfo color={PlayerColor.BLUE} name='Yolo' />
			<Victory color={PlayerColor.BLUE} name='Yolo' />

			<Grid
				onDrop={() => null}
				color={PlayerColor.BLUE}
				grid={[
					["E", "E", "E", "E", "E", "E", "B"],
					["E", "E", "E", "E", "E", "B", "G"],
					["E", "E", "E", "E", "E", "B", "B"],
					["E", "E", "E", "E", "E", "B", "G"],
					["G", "G", "G", "G", "G", "G", "B"],
					["G", "G", "G", "G", "G", "G", "G"],
				]}
			/>
			<hr />
		</div>
	);
}

export default App;
