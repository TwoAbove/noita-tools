import { Modal } from 'react-bootstrap';

const Profile = (props) => {
	return (
		<Modal size="lg" show={props.show} onHide={props.handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Profile</Modal.Title>
			</Modal.Header>
			<Modal.Body>Profile</Modal.Body>
		</Modal>
	);
};

export default Profile;
