/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Modal, ModalProps, Row, Col, FormControl } from 'react-bootstrap';
import Fuse from 'fuse.js';
import { useTranslation } from 'react-i18next';

import perks from '../services/SeedInfo/data/perks.json';
import perksObj from '../services/SeedInfo/data/obj/perks.json';
import Icon from './Icons/Icon';
import Clickable from './Icons/Clickable';
import Perk from './Icons/Perk';

const options = {
	minMatchCharLength: 2,
	// shouldSort: false,
	keys: ['id', 'ui_name', 'ui_description']
};

interface IPerkSelectProps {
	selected: string[];
	show: boolean;
	showSelected?: boolean;
	handleClose: () => void;
	handleOnClick: (id: string) => void;
	handleSelectedClicked?: (id: string) => void;
	modalProps?: Partial<ModalProps>;
}

const PerkSelect = (props: IPerkSelectProps) => {
	const {
		modalProps = {},
		showSelected,
		show,
		handleClose,
		handleOnClick,
		handleSelectedClicked,
		selected = []
	} = props;
	const [filter, setFilter] = useState('');

	const [fuse, setFuse] = useState(() => new Fuse(perks, options as any));

	const { t, i18n } = useTranslation('materials');

	useEffect(() => {
		setFuse(
			new Fuse(
				perks.map(p => ({
					...p,
					ui_name: t(p.ui_name),
					ui_description: t(p.ui_description)
				})),
				options as any
			)
		);
	}, [t, i18n, i18n.language]);

	const handleFilter = e => {
		setFilter(e.target.value);
	};

	const perksToShow = (filter
		? fuse.search(filter || ' ').map(p => p.item)
		: perks
	).filter(p => !selected.includes(p.id));

	return (
		<Modal
			{...modalProps}
			fullscreen="sm-down"
			scrollable
			show={show}
			onHide={handleClose}
		>
			<Modal.Header closeButton>
				<Modal.Title>Perk Select</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{showSelected && selected.length > 0 && (
					<Row className="p-3 justify-content-start align-items-center row-cols-auto">
						{selected.map(id => {
							const perk = perksObj[id];
							return (
								<Col className="p-0 m-1" key={perk.id}>
									<Perk onClick={() => handleSelectedClicked && handleSelectedClicked(perk.id)} perk={perk} />
								</Col>
							);
						})}
					</Row>
				)}
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
								<Perk onClick={() => handleOnClick(perk.id)} perk={perk} />
							</Col>
						);
					})}
				</Row>
			</Modal.Body>
		</Modal>
	);
};

export default PerkSelect;
