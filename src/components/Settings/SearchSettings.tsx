import { Col, Form, ListGroup } from 'react-bootstrap';
import useLocalStorage from '../../services/useLocalStorage';

// import { db } from "../services/db";

import { ConfigRow, ConfigTitle, PanelToggle } from './helpers';

const Multithread = () => {
	const [concurrency, setConcurrency] = useLocalStorage('search-max-concurrency', navigator.hardwareConcurrency);
	const handleRange = (e: any) => {
		setConcurrency(e.target.valueAsNumber);
	};

	const maxConcurrency = navigator.hardwareConcurrency;

	return (
		<ConfigRow
			left={
				<>
					<strong className="">Multithread limit</strong>
					<p className="text-muted mb-0">
						If Noitool is unstable with maximum concurrency, decrease this slider until it is.
						<br/>
						Disable and re-enable Multithreading in Search for changes to apply.
					</p>
				</>
			}
			right={
				<>
					<div className="d-flex justify-content-center">
						<Form.Group as={Col} xs={6} controlId="code">
							<Form.Label className="m-0">Max concurrency: {concurrency}</Form.Label>
							<Form.Range value={concurrency} onChange={handleRange} min="1" max={maxConcurrency} />
						</Form.Group>
					</div>
				</>
			}
		/>
	);
};

const SearchSettings = () => {
	return (
		<>
			<ConfigTitle
				title="Search"
				subtitle="Settings relating to seed search."
			/>
			<ListGroup variant="flush" className="mb-5 shadow">
				<ListGroup.Item>
					<Multithread />
				</ListGroup.Item>
			</ListGroup>
		</>
	);
};

export default SearchSettings;
