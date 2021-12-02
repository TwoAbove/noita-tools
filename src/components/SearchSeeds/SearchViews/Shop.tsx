import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Stack } from 'react-bootstrap';

import WandIcon from '../../Icons/Wand';
import LightBulletIcon from '../../Icons/LightBullet';

import { IRule } from '../../../services/SeedInfo/infoHandler';
import classNames from 'classnames';
import Clickable from '../../Icons/Clickable';

interface IShopProps {
	onUpdateConfig: (config: IRule) => void;
}

const Square = (props) => {
	const { children, ...rest } = props;
	return (<div {...rest} style={{ width: 48, height: 48 }} className={classNames("d-flex align-items-center justify-content-center")}>
		{children}
	</div>)
}

const Shop = (props: IShopProps) => {
	const { onUpdateConfig } = props;
	const [firstRender, setFirstRender] = useState(true);
	const [shopType, setShopType] = useState<
		Array<{ type: string; items: any[] }>
	>(new Array(7).fill(undefined));

	useEffect(() => {
		if (firstRender) {
			setFirstRender(false);
		}
		if (firstRender) {
			return;
		}
		onUpdateConfig({
			type: 'shop',
			path: '',
			params: [],
			val: shopType
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shopType]);

	const handleClicked = (i, type) => {
		const newShopType = [...shopType];
		if (!newShopType[i]) {
			newShopType[i] = { type, items: [] };
		} else {
			newShopType[i].type = type;
		}
		setShopType(newShopType);
	};

	return (
		<Container fluid>
			<Row className="justify-content-md-center">
				<Col xs="auto">
					<Stack gap={3}>
						{shopType.map((shop, i) => {
							return (
								<Row key={i}>
									<Col>
										<div>Level {i + 1}:</div>
										<Stack gap={3} direction="horizontal">
											<Clickable onClick={() => handleClicked(i, 'wand')} clicked={shop?.type === "wand"}>
												<Square>
													<WandIcon />
												</Square>
											</Clickable>
											<Clickable onClick={() => handleClicked(i, '')} clicked={!shop?.type}>
												<Square>
													Any
												</Square>
											</Clickable>
											<Clickable onClick={() => handleClicked(i, 'item')} clicked={shop?.type === "item"}>
												<LightBulletIcon />
											</Clickable>
										</Stack>
									</Col>
								</Row>
							);
						})}
					</Stack>
				</Col>
			</Row>
		</Container>
	);
};

export default Shop;
