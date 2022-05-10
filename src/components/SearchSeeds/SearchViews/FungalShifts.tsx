/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Stack, Button } from 'react-bootstrap';

import fungalMaterials from '../../../services/SeedInfo/data/fungal-materials.json';
import { IRule } from '../../../services/SeedInfo/infoHandler/IRule';
import { Square } from '../../helpers';
import {FlaskMaterialSelect} from '../../MaterialSelect';

interface IFungalShiftsProps {
	onUpdateConfig: (config: IRule) => void;
}

interface IOpen {
	open: boolean;
	row?: number;
	type?: string;
}

const materialsFrom = fungalMaterials.materials_from.flatMap(m => m.materials);
const materialsTo = fungalMaterials.materials_to.map(m => m.material);

const FungalShifts = (props: IFungalShiftsProps) => {
	const { onUpdateConfig } = props;
	const [firstRender, setFirstRender] = useState(true);
	const [fungalShifts, setFungalShifts] = useState<any[]>(
		new Array(20).fill(undefined)
	);
	const [selectOpen, setSelectOpen] = useState<IOpen>({ open: false });

	useEffect(() => {
		if (firstRender) {
			setFirstRender(false);
		}
		if (firstRender) {
			return;
		}
		onUpdateConfig({
			type: 'fungalShift',
			path: '',
			params: [],
			val: fungalShifts
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fungalShifts]);

	const getSelected = (row?: number, type?: string) => {
		if (typeof row == 'undefined') {
			return new Set<string>([]);
		}
		if (typeof type == 'undefined') {
			return new Set<string>([]);
		}
		if (!fungalShifts[row]) {
			return new Set<string>([]);
		}
		return new Set<string>(fungalShifts[row][type]);
	};

	const isSelected = (row, type) => {
		if (typeof row === 'undefined') {
			return false;
		}
		if (!fungalShifts[row]) {
			return false;
		}
		const t = type === 'to' ? 'flaskTo' : 'flaskFrom';
		return !!(fungalShifts[row][type] || fungalShifts[row][t]);
	};

	const getFlask = (row?: number, type?: string): boolean => {
		if (typeof row === 'undefined') {
			return false;
		}
		if (typeof type === 'undefined') {
			return false;
		}
		if (!fungalShifts[row]) {
			return false;
		}
		const t = type === 'to' ? 'flaskTo' : 'flaskFrom';
		return fungalShifts[row][t] || false;
	};

	const getList = (type?: string): string[] => {
		if (type === 'to') {
			return materialsTo;
		}
		if (type === 'from') {
			return materialsFrom;
		}
		return [];
	};

	const handleClear = (row: number) => {
		if (typeof row === 'undefined') {
			return;
		}
		delete fungalShifts[row];
		setFungalShifts([...fungalShifts]);
	};

	const handleSelect = (list: string[], row?: number, type?: string) => {
		if (typeof row === 'undefined') {
			return;
		}
		if (typeof type === 'undefined') {
			return;
		}
		if (!fungalShifts[row]) {
			fungalShifts[row] = {};
		}
		fungalShifts[row][type] = list;
		setFungalShifts([...fungalShifts]);
	};

	const handleFlask = (row?: number, type?: string, val?: boolean) => {
		if (typeof row === 'undefined') {
			return;
		}
		if (typeof type === 'undefined') {
			return;
		}
		if (!fungalShifts[row]) {
			fungalShifts[row] = {};
		}
		const t = type === 'to' ? 'flaskTo' : 'flaskFrom';
		if (val) {
			fungalShifts[row][t] = val;
		}
		if (!val) {
			delete fungalShifts[row][t];
		}
		setFungalShifts([...fungalShifts]);
	};

	const handleOpen = (row: number, type: string) => {
		setSelectOpen({ open: true, row, type });
	};

	const handleClose = () => {
		setSelectOpen({ open: false });
	};

	return (
		<Container fluid>
			<p>
				Lists can be left blank if any material will do. <br />
				At least one of the selected materials will be in the found seeds.
			</p>
			<Stack gap={2}>
				{fungalShifts.map((shift, i) => {
					return (
						<Stack direction="horizontal" gap={3} key={i}>
							<Col xs={1}>Shift {i + 1}</Col>
							<Col xs="auto">
								<Button
									variant={
										isSelected(i, 'from') ? 'primary' : 'outline-primary'
									}
									onClick={() => handleOpen(i, 'from')}
								>
									<Square>Edit From</Square>
								</Button>
							</Col>
							<Col xs="auto">
								<Button
									variant={isSelected(i, 'to') ? 'primary' : 'outline-primary'}
									onClick={() => handleOpen(i, 'to')}
								>
									<Square>Edit To</Square>
								</Button>
							</Col>
							{shift && (
								<Col>
									<Button
										variant="outline-primary"
										onClick={() => handleClear(i)}
									>
										<Square>Clear</Square>
									</Button>
								</Col>
							)}
						</Stack>
					);
				})}
			</Stack>
			<FlaskMaterialSelect
				show={selectOpen.open}
				selected={getSelected(selectOpen.row, selectOpen.type)}
				useFlask={getFlask(selectOpen.row, selectOpen.type)}
				list={getList(selectOpen.type)}
				handleClose={() => handleClose()}
				handleFlask={val => handleFlask(selectOpen.row, selectOpen.type, val)}
				handleOnUpdate={list =>
					handleSelect(list, selectOpen.row, selectOpen.type)
				}
			/>
		</Container>
	);
};

export default FungalShifts;
