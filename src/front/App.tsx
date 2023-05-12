import { NameSelector } from "./screen/NameSelector";
import "./css/index.css";
import { ColorSelector } from "./screen/ColorSelector";
import { PlayerColor } from "../types";
import { Grid } from "./components/Grid";
import { PlayScreen } from "./screen/PlayScreen";

function App() {
	return (
		<div className='container'>
			<PlayScreen color={PlayerColor.BLUE} name='Yolo' />
			{/* <VictoryScreen color={PlayerColor.BLUE} name='Yolo' /> */}

			<Grid
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
			<NameSelector onSelect={() => null} disabled />
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
		</div>
	);
}

export default App;
