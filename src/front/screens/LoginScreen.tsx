import { v4 } from "uuid";
import { PlayerSession, QueryParams } from "../../types";
import { NameSelector } from "../components/NameSelector";
import { saveSession } from "../func/session";
import { updateQueryParams, urlSearchParams } from "../func/url";
import { useGame } from "../hooks/useGame";

type LoginScreenProps = {};

export function LoginScreen({}: LoginScreenProps) {
	const { connect } = useGame();
	const handleLogin = async (name: string) => {
		const response: PlayerSession = await fetch("api/players", {
			method: "POST",
		}).then((r) => r.json());

		// Le joueur est créé et sauvegardé en session
		const player = saveSession({
			...response,
			name,
		});

		// On récupère le gameId dans l'url, sinon on en génère un nouveau
		const gameId = urlSearchParams().get(QueryParams.GAMEID) ?? v4();
		connect(player, gameId);

		// Redirige l'utilisateur vers l'URL
		updateQueryParams({ [QueryParams.GAMEID]: gameId });
	};
	return (
		<div>
			<NameSelector onSelect={handleLogin} />
		</div>
	);
}
