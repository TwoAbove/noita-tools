import { ListGroup } from 'react-bootstrap';

// import { db } from "../services/db";

import { ConfigTitle, PanelToggle } from './helpers';


const PanelsSettings = () => {
	return (
		<>
			<ConfigTitle
				title="Panels"
				subtitle="Choose which info panels you want to see."
			/>
			<ListGroup variant="flush" className="mb-5 shadow">
				<ListGroup.Item>
					<PanelToggle key="alchemy" id="alchemy" title="Alchemy" />
				</ListGroup.Item>
				<ListGroup.Item>
					<PanelToggle key="biome" id="biome" title="Biome" />
				</ListGroup.Item>
				<ListGroup.Item>
					<PanelToggle key="fungal" id="fungal" title="Fungal Shifts" />
				</ListGroup.Item>
				<ListGroup.Item>
					<PanelToggle
						key="holy-mountain"
						id="holy-mountain"
						title="Holy Mountain"
					/>
				</ListGroup.Item>
				<ListGroup.Item>
					<PanelToggle key="rain" id="rain" title="Rain" />
				</ListGroup.Item>
				<ListGroup.Item>
					<PanelToggle key="start" id="start" title="Starting Setup" />
				</ListGroup.Item>
				<ListGroup.Item>
					<PanelToggle key="watercave" id="watercave" title="Water Cave" />
				</ListGroup.Item>
			</ListGroup>
		</>
	)
}

export default PanelsSettings;
