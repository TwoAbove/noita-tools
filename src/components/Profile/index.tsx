import { FC, useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import humanize from 'humanize-duration';

import PatreonButton from '../misc/PatreonButton';

import { ProfileContext, IPatreonData } from './ProfileContext';
import { Link } from 'react-router-dom';

const oauthLink = () => {
	const noitoolSessionToken = Cookies.get('noitoolSessionToken');

	const patreonLink = new URL('https://www.patreon.com/oauth2/authorize');
	patreonLink.searchParams.append('response_type', 'code');
	patreonLink.searchParams.append(
		'client_id',
		process.env.REACT_APP_PATREON_ID!
	);
	patreonLink.searchParams.append(
		'redirect_uri',
		process.env.REACT_APP_PATREON_REDIRECT_URL!
	);
	// patreonLink.searchParams.append('scope', 'identity, identity[email], identity.memberships, campaigns');
	patreonLink.searchParams.append('state', noitoolSessionToken!);

	return patreonLink.toString();
};

const LinkPatreon = () => {
	return (
		<div>
			<p>
				Connect your Patreon account to unlock extra features of Noitool{' '}
				<b>(no patronage necessary)</b>:
			</p>
			<ul>
				<li>Sync Noitool across devices (in development)</li>
				<li>
					Enjoy 5 compute-hours of cluster-assisted search each month, on me!
				</li>
			</ul>
			<br />
			<a href={oauthLink()}>Connect Patreon account</a>
			<div className="my-5" />
		</div>
	);
};

const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });

const suffixes = new Map([
	['one', 'st'],
	['two', 'nd'],
	['few', 'rd'],
	['other', 'th']
]);
const formatOrdinals = n => {
	const rule = pr.select(n);
	const suffix = suffixes.get(rule);
	return `${n}${suffix}`;
};

const h = (t: number) => humanize(t, { round: true, units: ['h', 'm'] });

interface IPatreonDataProps {
	data: IPatreonData;
}
const PatreonData: FC<IPatreonDataProps> = ({ data }) => {
	const {
		patreonId,
		noitoolId,
		userName,
		computeLeft,
		patreonComputeLeft,
		providedComputeLeft,
		resetDay
	} = data;
	return (
		<div>
			<p>
				Connected as <b>{userName}</b>
				<br />
				<small className="fw-light">
					{patreonId} / {noitoolId}
				</small>
			</p>
			<div>
				<p>
					You have <b>{h(computeLeft)}</b> of compute time left
				</p>
				<p>
					Compute time left from your Patreon pledge: {h(patreonComputeLeft)}{' '}
					<br />
					<small className="text-muted mt-0">
						Resets on the {formatOrdinals(resetDay || 0)} of each month
					</small>
				</p>
				<p>
					Compute time left from providing cluster resources:{' '}
					{h(providedComputeLeft)} <br />
					<small className="text-muted mt-0">
						Visit the <Link to="/compute">Compute Page</Link> to learn more
					</small>
				</p>
			</div>
		</div>
	);
};

const PatreonAccount = () => {
	const {
		patreonData,
		patreonDataLoading,
		patreonDataError,
		handleLogout
	} = useContext(ProfileContext);

	const loggedIn = !!patreonData;

	if (patreonDataError) {
		return (
			<div>
				<h3>Patreon Account</h3>
				<p>
					An error occurred while fetching your Patreon data. Please try again
					later.
				</p>
			</div>
		);
	}

	return (
		<div className='d-flex flex-column'>
			<h3>Patreon Account</h3>
			{patreonDataLoading ? (
				<p>Loading...</p>
			) : (
				<>
					{!loggedIn && <LinkPatreon />}
					{patreonData && <PatreonData data={patreonData} />}
					{patreonData && patreonData.activePatron ? (
						<p>Thank you for your support!</p>
					) : (
						<PatreonButton />
					)}
					{loggedIn && (
						<Button className='ms-auto' variant='outline-secondary' onClick={() => handleLogout()}>Disconnect Patreon</Button>
					)}
				</>
			)}
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
