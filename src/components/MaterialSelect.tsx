/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, ButtonGroup, Col, Form, Modal, Row } from 'react-bootstrap';

import ListSelect from './ListSelect';

interface IMaterialSelectProps {
	show: boolean;
	selected: Set<string>;
	list: string[];
	useFlask: boolean;

	handleClose: () => void;
	handleOnSelect: (list: string[]) => void;
	handleFlask: (val: boolean) => void;
}

const MaterialSelect = (props: IMaterialSelectProps) => {
	const {
		show,
		handleClose,
		handleOnSelect,
		selected,
		list,
		useFlask,
		handleFlask
	} = props;
	const onDeselectAll = () => {
		handleOnSelect([]);
	};

	const onSelectAll = () => {
		handleOnSelect([...list]);
	};

	return (
		<Modal fullscreen="sm-down" scrollable show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Material Selector</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row className="mb-3 align-items-center">
					<Col className="me-3">
						<ButtonGroup size="sm">
							<Button variant="outline-primary" onClick={() => onSelectAll()}>
								Select All
							</Button>
							<Button variant="outline-primary" onClick={() => onDeselectAll()}>
								Deselect All
							</Button>
						</ButtonGroup>
					</Col>
					<Col xs={3}>
						<Form.Switch
							checked={useFlask}
							onChange={e => {
								handleFlask(e.target.checked);
							}}
							id="custom-switch"
							label="Flask"
						/>
					</Col>
				</Row>
				<ListSelect
					selected={selected}
					items={list}
					onUpdate={set => handleOnSelect([...set])}
				/>
			</Modal.Body>
		</Modal>
	);
};

export default MaterialSelect;
