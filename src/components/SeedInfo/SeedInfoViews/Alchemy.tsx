import React, { useContext } from 'react';
import { Container, ListGroup, ListGroupItem, Stack } from 'react-bootstrap';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import { capitalize } from '../../../services/helpers';
import { AlchemyConfigContext } from '../../AlchemyConfigContext';
import useLocalStorage from '../../../services/useLocalStorage';

interface IAlchemyProps {
	alchemy: {
		LC: string[];
		AP: string[]
	}
	infoProvider: GameInfoProvider;
}

const Alchemy = (props: IAlchemyProps) => {
	const { alchemy, infoProvider } = props;
	const [showId] = useContext(AlchemyConfigContext);
	return (
		<Container>
			<Stack direction="horizontal">
			<div className="p-2 flex-grow-1" />

				<div>
					Lively Concoction:
					<ListGroup>
						{alchemy.LC.map(l => (
							<ListGroupItem key={l}>
								{capitalize(
									infoProvider.providers.material.translate(l)
								)} {showId && `(${l})`}
							</ListGroupItem>
						))}
					</ListGroup>
				</div>
        <div className="p-2 flex-grow-1" />
				<div>
					Alchemic Precursor:
					<ListGroup>
						{alchemy.AP.map(l => (
							<ListGroupItem key={l}>
								{capitalize(
									infoProvider.providers.material.translate(l)
								)} {showId && `(${l})`}
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
