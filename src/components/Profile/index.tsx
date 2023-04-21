import { Modal } from 'react-bootstrap';

const LinkPatreon = () => {
	return (
		<div>
			Link your patreon account to access many great features:
			<ul>
				<li>Sync across devices</li>
				<li>Cluster assisted search</li>
			</ul>
			<br />
			<a href="/api/patreon/login">
				<img
					src="https://c5.patreon.com/external/logo/become_a_patron_button.png"
					alt="Become a Patron!"
				/>
			</a>
		</div>
	);
};

const PatreonAccount = () => {
	const loggedIn = false;

	return (
		<div>
			<h3>Patreon Account</h3>
			{!loggedIn && <LinkPatreon />}
		</div>
	);
};

const Profile = props => {
	return (
		<Modal size="lg" show={props.show} onHide={props.handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Profile</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<PatreonAccount />
			</Modal.Body>
		</Modal>
	);
};

export default Profile;
