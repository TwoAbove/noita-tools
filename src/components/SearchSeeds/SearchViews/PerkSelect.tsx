/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Modal, Row, Col, FormControl } from 'react-bootstrap';
import Fuse from 'fuse.js';

import perks from '../../../services/SeedInfo/data/perks_new.json';
import Icon from '../../Icons/Icon';
import Clickable from '../../Icons/Clickable';

const options = {
	minMatchCharLength: 2,
	// shouldSort: false,
	keys: ['id', 'ui_name']
};

const fuse = new Fuse(perks, options);

interface IPerkSelectProps {
	selectedPerks: string[];
	show: boolean;
	handleClose: () => void;
	handleOnClick: (id: string) => void;
}

const PerkSelect = (props: IPerkSelectProps) => {
	const { show, handleClose, handleOnClick, selectedPerks = [] } = props;
	const [filter, setFilter] = useState('');

	const handleFilter = e => {
		setFilter(e.target.value);
	};

	const perksToShow = (filter
		? fuse
				.search(filter || ' ')
				.map(p => p.item)
		: perks).filter(p => !selectedPerks.includes(p.id));

	return (
		<Modal fullscreen="sm-down" scrollable show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Perk Select</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row className="p-1 ps-4 pe-4 align-items-center">
					<FormControl
						type="search"
						placeholder="Filter"
						className=""
						aria-label="Filter"
						value={filter}
						onChange={handleFilter}
					/>
				</Row>
				<Row className="p-3 justify-content-center align-items-center row-cols-auto">
					{perksToShow.map(perk => {
						return (
							<Col className="p-0 m-1" key={perk.id}>
								<Clickable>
									<Icon
										onClick={() => handleOnClick(perk.id)}
										uri={'data:image/png;base64,' + perk.ui_icon}
										alt={perk.ui_name}
										title={perk.ui_name}
									/>
								</Clickable>
							</Col>
						);
					})}
				</Row>
			</Modal.Body>
		</Modal>
	);
};

export default PerkSelect;
