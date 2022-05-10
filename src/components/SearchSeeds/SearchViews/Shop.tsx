import React, { useReducer, useState, useEffect } from 'react';
import { Row, Col, Container, Stack, Button } from 'react-bootstrap';

import WandIcon from '../../Icons/Wand';
import Clickable from '../../Icons/Clickable';
import LightBulletIcon from '../../Icons/LightBullet';
import { IRule } from '../../../services/SeedInfo/infoHandler/IRule';
import { IShopType } from '../../../services/SeedInfo/infoHandler/InfoProviders/Shop';

import { Square } from '../../helpers';
// import ShopSelect from './ShopSelect';
import SpellSelect from '../../SpellSelect';
import WandSelect from '../../WandSelect';
import { cloneDeep } from 'lodash';

interface IShopLevelProps {
	handleClicked: (string) => void;
	handleClickModal: () => void;
	shop: any;
	level: number;
}

const ShopLevel = (props: IShopLevelProps) => {
	const {
		handleClicked,
		handleClickModal,
		shop,
		level
	} = props;
	return (
		<Row>
			<Col>
				<div className="d-flex flex-column">
					<div>Level {level + 1}:</div>
					<Stack gap={3} direction="horizontal">
						<div>{ }</div>
						<Clickable
							onClick={() => handleClicked(IShopType.wand)}
							clicked={shop.type === IShopType.wand}
						>
							<Square>
								<WandIcon />
							</Square>
						</Clickable>
						<Clickable onClick={() => handleClicked('')} clicked={!shop.type}>
							<Square>Any</Square>
						</Clickable>
						<Clickable
							onClick={() => handleClicked(IShopType.item)}
							clicked={shop.type === IShopType.item}
						>
							<LightBulletIcon />
						</Clickable>
					</Stack>
					{!!shop.type && (
						<Button onClick={handleClickModal} className="m-1">
							Advanced Filter
						</Button>
					)}
				</div>
			</Col>
		</Row>
	);
};

type IConfig = Array<{ type: string; items: any[] }>;
interface IAction {
	action: string;
	level: number;
	data?: any;
}

const shopReducer = (state: IConfig, a: IAction): IConfig => {
	const { action, data, level } = a;
	const newState = cloneDeep(state);
	switch (action) {
		case 'type': {
			if (!newState[level]) {
				newState[level] = { type: data, items: [] };
			} else {
				newState[level].type = data;
			}
			return newState;
		}
		case 'spell-add': {
			if (!newState[level].items) {
				newState[level].items = [];
			}
			newState[level].items.push(data);
			return newState;
		}
		case 'spell-remove': {
			if (!newState[level].items) {
				newState[level].items = [];
			}
			newState[level].items.splice(newState[level].items.indexOf(data), 1);
			return newState;
		}
	}
	return state;
};

interface IShopProps {
	onUpdateConfig: (config: IRule) => void;
}

const Shop = (props: IShopProps) => {
	const { onUpdateConfig } = props;
	const [d, setModal] = useState<[number, number]>([-1, 0]);
	const level = d[0];
	const shopType = d[1];
	const [shops, dispatch] = useReducer(
		shopReducer,
		new Array(7).fill(undefined)
	);

	useEffect(() => {
		onUpdateConfig({
			type: 'shop',
			path: '',
			params: [],
			strict: true,
			val: shops
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shops]);

	const handleItemClickedAdd = (thing: any) => {
		dispatch({ action: 'spell-add', level, data: thing });
	};
	const handleItemClickedRemove = (thing: any) => {
		dispatch({ action: 'spell-remove', level, data: thing });
	};

	const handleTypeClicked = (l, type) => {
		dispatch({ data: type, level: l, action: 'type' });
	};

	const handleOpenAdvancedModal = (i, type) => {
		setModal([i, type]);
	};

	const handleCloseAdvancedModal = () => {
		setModal([-1, 0]);
	};

	const ShopSelect = shopType === IShopType.item ? SpellSelect : WandSelect;

	return (
		<Container fluid>
			<p>
				Compute-intensive is used. Use sparingly!
			</p>
			<Row className="justify-content-md-center">
				<Col xs="auto">
					<Stack gap={3}>
						{shops.map((shop, i) => {
							return (
								<ShopLevel
									handleClicked={type => handleTypeClicked(i, type)}
									handleClickModal={() => handleOpenAdvancedModal(i, shop.type)}
									level={i}
									shop={shop || {}}
									key={i}
								/>
							);
						})}
					</Stack>
				</Col>
			</Row>
			<ShopSelect
				level={level}
				type={shopType}
				selected={shops[level]?.items}
				show={level !== -1}
				showSelected
				handleClose={handleCloseAdvancedModal}
				handleOnClick={id => handleItemClickedAdd(id)}
				handleSelectedClicked={item => handleItemClickedRemove(item)}
			/>
		</Container>
	);
};

export default Shop;
