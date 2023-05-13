import { prevent } from "../../func/dom";

type Draw = {
	onRestart?: () => void;
};

export function Draw({ onRestart }: Draw) {
	return (
		<div className='flex' style={{ justifyContent: "space-between" }}>
			<h2 className='flex' style={{ gap: ".6rem" }}>
				It's a draw
			</h2>

			<button className='button' onClick={prevent(onRestart)}>
				Play again
			</button>
		</div>
	);
}
