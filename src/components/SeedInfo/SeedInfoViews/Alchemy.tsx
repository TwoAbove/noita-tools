import React, { useContext } from 'react';
import { Container, ListGroup, ListGroupItem, Stack } from 'react-bootstrap';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import { capitalize } from '../../../services/helpers';
import { AlchemyConfigContext } from '../../AlchemyConfigContext';
import { useMaterialFavorite } from './helpers';
import classNames from 'classnames';

interface IAlchemyProps {
	alchemy: {
		LC: string[];
		AP: string[];
	};
	infoProvider: GameInfoProvider;
}

const Alchemy = (props: IAlchemyProps) => {
	const { alchemy, infoProvider } = props;
	const [showId] = useContext(AlchemyConfigContext);
	const { isFavorite } = useMaterialFavorite();
	return (
		<Container>
			<Stack direction="horizontal">
				<div className="p-2 flex-grow-1" />
				<div>
					Lively Concoction:
					<ListGroup>
						{alchemy.LC.map(l => (
							<ListGroupItem key={l} className={classNames(isFavorite(l) && 'text-info')}>
								{capitalize(infoProvider.providers.material.translate(l))}{' '}
								{showId && `(${l})`}
							</ListGroupItem>
						))}
					</ListGroup>
				</div>
				<div className="p-2 flex-grow-1" />
				<div>
					Alchemic Precursor:
					<ListGroup>
						{alchemy.AP.map(l => (
							<ListGroupItem key={l} className={classNames(isFavorite(l) && 'text-info')}>
								{capitalize(infoProvider.providers.material.translate(l))}{' '}
								{showId && `(${l})`}
							</ListGroupItem>
						))}
					</ListGroup>
				</div>
				<div className="p-2 flex-grow-1" />
			</Stack>
		</Container>
	);
};

export default Alchemy;
