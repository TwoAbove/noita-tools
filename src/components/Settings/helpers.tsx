import React, { useState, useContext } from 'react';
import { ListGroup, Form, Modal, Col, Row, Button } from 'react-bootstrap';
import useLocalStorage from '../../services/useLocalStorage';

interface IConfigRowProps {
	left: React.ReactElement;
	right: React.ReactElement;
}
export const ConfigRow = (props: IConfigRowProps) => {
	// Maybe make this work with children and not left/right props?
	return (
		<Row className="align-items-center">
			<Col>{props.left}</Col>
			<Col className="col-auto">{props.right}</Col>
		</Row>
	);
};

export const ConfigTitle = (props: { title: string; subtitle: string }) => {
	return (
		<div className='ms-2'>
			<strong>{props.title}</strong>
			<div className="pb-3">{props.subtitle}</div>
		</div>
	);
};

interface IPanelToggleProps {
	id: string;
	title: string;
}
export const PanelToggle = (props: IPanelToggleProps) => {
	const { id, title } = props;
	const [show, setShow] = useLocalStorage(`panel-${id}-config`, true);
	return (
		<ConfigRow
			left={
				<>
					<strong className="">{title}</strong>
				</>
			}
			right={
				<Form.Switch
					checked={show}
					onChange={e => {
						setShow(e.target.checked);
					}}
					id={`panel-${id}-config-switch`}
					label=""
				/>
			}
		/>
	);
};
