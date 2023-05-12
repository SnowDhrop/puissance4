import { useState, FormEvent } from "react";

type NameSelectorProps = {
	onSelect: (name: string) => void;
	disabled?: boolean;
};

export function NameSelector({ onSelect, disabled }: NameSelectorProps) {
	const [error, setError] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		const name = new FormData(e.currentTarget as HTMLFormElement).get("name");

		if (!name || name.toString().trim() === "") {
			setError("You have to choose a pseudo");
			return;
		}

		onSelect(name.toString());
	};

	return (
		<>
			<h1>Choose a pseudo</h1>
			{error && (
				<div className='alert'>
					{error}
					<button onClick={() => setError("")} className='alert___close'>
						&times;
					</button>
				</div>
			)}
			<form
				className='flex'
				style={{ gap: "0.5rem" }}
				action=''
				onSubmit={handleSubmit}
			>
				<label htmlFor='name'>Your pseudo</label>
				<input disabled={disabled} type='text' id='name' name='name' required />

				<button className='button' disabled={disabled}>
					Choose
				</button>
			</form>
		</>
	);
}
