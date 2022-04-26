import { Button, ListGroup } from "react-bootstrap";
import { ConfigRow, ConfigTitle } from "./helpers";

const PerkFavorites = () => {
	return (
		<ConfigRow
			left={
				<>
					<strong className="">Perks</strong>
				</>
			}
			right={
				<>
					<Button size="sm">Select Perks</Button>
				</>
			}
		/>
	);
};
const SpellFavorites = () => {
	return (
		<ConfigRow
			left={
				<>
					<strong className="">Spells</strong>
				</>
			}
			right={
				<>
					<Button size="sm">Select Spells</Button>
				</>
			}
		/>
	);
};
const MaterialFavorites = () => {
	return (
		<ConfigRow
			left={
				<>
					<strong className="">Materials</strong>
				</>
			}
			right={
				<>
					<Button size="sm">Select Materials</Button>
				</>
			}
		/>
	);
};

const FavoritesSettings = () => {
	return (
		<>
			<ConfigTitle
				title="Favorites"
				subtitle="Things chosen here will be highlighted so they are easier to spot."
			/>
			<ListGroup variant="flush" className="mb-5 shadow">
				<ListGroup.Item>
					<PerkFavorites />
				</ListGroup.Item>
				<ListGroup.Item>
					<SpellFavorites />
				</ListGroup.Item>
				<ListGroup.Item>
					<MaterialFavorites />
				</ListGroup.Item>
			</ListGroup>
		</>
	)
};

export default FavoritesSettings;
