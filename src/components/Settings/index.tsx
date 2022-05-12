import { Modal } from 'react-bootstrap';

// import { db } from "../services/db";

import NeedInputAlert from './NeedInput';
import GeneralSettings from './GeneralSettings';
import PanelsSettings from './PanelsSettings';
import DangerSettings from './DangerSettings';
import FavoritesSettings from './FavoritesSettings';

// TODO: All of these can be simplified to [</>,...].map for config values
// so that we don't repeat the settings blocks.
const Settings = props => {
	return (
		<Modal size="lg" show={props.show} onHide={props.handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Settings</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<NeedInputAlert />
				<GeneralSettings />
				<hr className="my-4" />
				<PanelsSettings />
				<hr className="my-4" />
				<FavoritesSettings />
				<hr className="my-4" />
				<DangerSettings />
			</Modal.Body>
		</Modal>
	);
};

export default Settings;
