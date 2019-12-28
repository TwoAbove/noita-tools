import React from 'react';
import { Button, Input, Label, Form, FormGroup, Col } from 'reactstrap';

interface ISeedFormProps {
	onSubmit(seed: string): void;
}

const SeedForm = (props: ISeedFormProps) => {
	const { onSubmit } = props;
	const [seed, setSeed] = React.useState('');

	const handleNameChange = (e: any) => {
		setSeed(e.target.value);
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		onSubmit(seed);
		setSeed('');
	};

	return (
		<Form className="seedForm" onSubmit={handleSubmit}>
			<FormGroup className="formGroup" row>
				<Label className="label" for="seed">
					Seed
				</Label>
				<Col>
					<Input
						id="seed"
						type="number"
						value={seed}
						onChange={handleNameChange}
					/>
				</Col>
			</FormGroup>
			<Button className="submitButton" type="submit" color="primary">
				Submit
			</Button>
		</Form>
	);
};

export default SeedForm;
