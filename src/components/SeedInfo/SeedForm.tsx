import React from 'react';
import { Button, Form, Stack } from 'react-bootstrap';

interface ISeedFormProps {
	onSubmit(seed: string): void;
}

const SeedForm = (props: ISeedFormProps) => {
	const { onSubmit } = props;
	const [seed, setSeed] = React.useState('');

	const handleNameChange = (e: any) => {
		if (e.target.value < 0) {
			return;
		}
		setSeed(e.target.value);
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		onSubmit(seed);
		setSeed('');
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Label className="label" htmlFor="seedForm.seed">
				Enter the seed number to get information about it
			</Form.Label>
			<Stack direction="horizontal" gap={5}>
				<Form.Control
					id="seedForm.seed"
					placeholder="Seed"
					type="number"
					value={seed}
					onChange={handleNameChange}
				/>
				<Button className="me-3" type="submit" color="primary">
					Submit
				</Button>
			</Stack>
		</Form>
	);
};

export default SeedForm;
