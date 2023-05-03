import { useState } from 'react';
import { Button, Col, Form, ListGroup } from 'react-bootstrap';
import { resetDatabase, clearSeeds } from '../../services/db';
import { ConfigRow, ConfigTitle } from './helpers';

import SyncHandler from './SyncHandler';

const SyncApp = () => {
	const [syncId, setSyncId] = useState('');
	const [thisId, setThisId] = useState<string | number>('');
	const [sent, setSent] = useState(false);
	const [synced, setSynced] = useState(false);
	const [handler] = useState(() => new SyncHandler());

	const handleSync = async () => {
		await handler.getSettingsFrom(syncId);
		setSyncId('');
		setThisId('');
		setSynced(true);
	};

	const handleSend = async () => {
		await handler.sendToSync().then(id => {
			setThisId(id);
			setSent(true);
		});
	};
	const handleChange = (e: any) => {
		if (e.target.validity.valid) {
			setSyncId(e.target.value);
		} else if (syncId === '' || syncId === '-') {
			setSyncId(syncId);
		}
	};
	return (
		<ConfigRow
			left={
				<>
					<strong className="text-info">Sync with other Noitool</strong>
					<p className="text-muted fw-light mb-0">
						Copy noitool config from another online noitool. This includes all
						seed configs and settings.
						<br />
						The code will be usable for 15 minutes.
					</p>
				</>
			}
			right={
				<div className="my-1">
					<div className="d-flex justify-content-between mb-2">
						<p>{sent ? `Your Code: ${thisId}` : ``}</p>
						<Button
							variant={sent ? 'success' : 'outline-info'}
							onClick={handleSend}
						>
							{sent ? 'Sent' : 'Send this Noitool for syncing'}
						</Button>
					</div>
					<div className="d-flex justify-content-between">
						<Form.Group as={Col} xs={12} sm={12} md={9} controlId="code">
							<Form.Label>Enter code to sync from</Form.Label>
							<Form.Control
								onChange={handleChange}
								value={syncId}
								size="sm"
								type="tel"
								pattern="[0-9]*"
								placeholder="Code"
							/>
						</Form.Group>
						<Button variant={synced ? 'success' : 'info'} onClick={handleSync}>
							{synced ? 'Synced' : 'Sync'}
						</Button>
					</div>
				</div>
			}
		/>
	);
};

const ResetApp = () => {
	const handleClick = async () => {
		await resetDatabase();
	};

	return (
		<ConfigRow
			left={
				<>
					<strong className="text-danger">Reset Noitool</strong>
					<p className="text-muted fw-light mb-0">
						Clear all persistent data of Noitool. <br />
						This includes all seed configs and settings.
					</p>
				</>
			}
			right={
				<>
					<Button variant="danger" onClick={handleClick}>
						Reset Noitool
					</Button>
				</>
			}
		/>
	);
};

const ResetSeeds = () => {
	const handleClick = async () => {
		await clearSeeds();
	};

	return (
		<ConfigRow
			left={
				<>
					<strong className="text-warning">Clear Seed states</strong>
					<p className="text-muted fw-light mb-0">
						Clear all saved seed states. <br />
						Use this if there are issues with getting seed info.
					</p>
				</>
			}
			right={
				<>
					<Button variant="warning" onClick={handleClick}>
						Clear seed states
					</Button>
				</>
			}
		/>
	);
};

const DangerSettings = () => {
	return (
		<>
			<ConfigTitle title="Danger Zone" subtitle="Be careful with these." />
			<ListGroup variant="flush" className="mb-5 shadow">
				<ListGroup.Item>
					<SyncApp />
				</ListGroup.Item>
				<ListGroup.Item>
					<ResetSeeds />
				</ListGroup.Item>
				<ListGroup.Item>
					<ResetApp />
				</ListGroup.Item>
			</ListGroup>
		</>
	);
};
export default DangerSettings;
