import React, { ReactNode, useMemo } from 'react';
import { Form, Col, Row, Container } from 'react-bootstrap';
import { useDropzone, DropzoneOptions } from 'react-dropzone';

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

export const ConfigTitle = (props: {
	title: ReactNode;
	subtitle: ReactNode;
}) => {
	return (
		<div className="ms-2">
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

const baseStyle = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '20px',
	borderWidth: 2,
	borderRadius: 2,
	borderColor: '#eeeeee',
	borderStyle: 'dashed',
	backgroundColor: '#fafafa',
	color: '#bdbdbd',
	outline: 'none',
	transition: 'border .24s ease-in-out'
};

const focusedStyle = {
	borderColor: '#2196f3'
};

const acceptStyle = {
	borderColor: '#00e676'
};

const rejectStyle = {
	borderColor: '#ff1744'
};

export const DropZone = (props: { onDrop: DropzoneOptions['onDrop'] }) => {
	const { onDrop } = props;
	const {
		getRootProps,
		getInputProps,
		isFocused,
		isDragAccept,
		isDragReject
	} = useDropzone({ onDrop });

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isFocused ? focusedStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {})
		}),
		[isFocused, isDragAccept, isDragReject]
	);

	return (
		<Container className='text-center border rounded-3 border-2' {...getRootProps()}>
			<input {...getInputProps()} />
			<p>Drag 'n' drop the folder here, or click to select files</p>
		</Container>
	);
};
