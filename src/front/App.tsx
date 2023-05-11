import { NameSelector } from "./screen/NameSelector";
import "./css/index.css";
import { ColorSelector } from "./screen/ColorSelector";
import { PlayerColor } from "../types";
import { Grid } from "./screen/Grid";

function App() {
	return (
		<div className='container'>
			<Grid
				grid={[
					["E", "E", "E", "E", "E", "E", "B"],
					["E", "E", "E", "E", "E", "B", "G"],
					["E", "E", "E", "E", "E", "B", "B"],
					["E", "E", "E", "E", "E", "B", "G"],
					["E", "E", "E", "E", "E", "G", "B"],
					["E", "E", "E", "E", "E", "G", "G"],
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
