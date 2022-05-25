import { Container, Stack, Row, Col } from 'react-bootstrap';

import SearchContextProvider from './SearchContext';
import RuleConstructor from './RuleConstructor';
import RuleList from './RuleList';

const SearchSeeds = () => {
	return (
		<Container className="col container shadow-lg">
			<Stack>
				<Row>
					<SearchContextProvider>
						<Col className="border rounded-3" xs={12} md={3}>
							<RuleList />
						</Col>
						<Col className="mx-auto" xs={12} md={9}>
							<RuleConstructor />
						</Col>
					</SearchContextProvider>
				</Row>
			</Stack>
		</Container>
	);
};

export default SearchSeeds;
