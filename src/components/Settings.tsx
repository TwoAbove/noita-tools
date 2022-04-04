import React, { useState, useContext } from 'react';
import { ListGroup, Form, Modal, Col, Row } from 'react-bootstrap';
import DarkModeToggle from 'react-dark-mode-toggle';

// import { db } from "../services/db";
import i18n from '../i18n';

import './App.css';
import { SpoilerContext } from './SpoilerContext';
import { ThemeContext } from './ThemeContext';
import { AlchemyConfigContext } from './AlchemyConfigContext';
import useLocalStorage from '../services/useLocalStorage';

const getFlagEmoji = countryCode =>
	String.fromCodePoint(
		...[...countryCode.toUpperCase()].map(x => 0x1f1a5 + x.charCodeAt())
	);

const flags = {
	de: 'de',
	en: 'us',
	es: 'es',
	fr: 'fr',
	jp: 'jp',
	ko: 'kr',
	pl: 'pl',
	pt: 'pt',
	ru: 'ru',
	'zh-CN': 'cn'
};

interface IConfigRowProps {
	left: React.ReactElement;
	right: React.ReactElement;
}
const ConfigRow = (props: IConfigRowProps) => {
	// Maybe make this work with children and not left/right props?
	return (
		<Row className="align-items-center">
			<Col>{props.left}</Col>
			<Col className="col-auto">{props.right}</Col>
		</Row>
	);
};

const ConfigTitle = (props: { title: string; subtitle: string }) => {
	return (
		<>
			<strong>{props.title}</strong>
			<div className="pb-3">{props.subtitle}</div>
		</>
	);
};

const Locale = () => {
	const [l, sl] = useState(i18n.language);

	const setLocale = lng => {
		i18n.changeLanguage(lng);
		sl(lng);
	};

	return (
		<ConfigRow
			left={
				<>
					<strong className="">Locale</strong>
					<p className="text-muted mb-0">
						Change the localization on Noitool. Currently, only materials are
						translated.
					</p>
				</>
			}
			right={
				<Form.Select
					onChange={e => {
						setLocale(e.target.value);
					}}
					value={l}
					size="sm"
					aria-label="Locale"
					style={{
						width: '9rem'
					}}
				>
					{Object.keys(flags).map(l => (
						<option value={l} key={l}>
							{getFlagEmoji(flags[l])} {flags[l]}
						</option>
					))}
				</Form.Select>
			}
		/>
	);
};

const AlchemyConfig = () => {
	const [advancedPerks, setAdvancedPerks] = useContext(AlchemyConfigContext);
	return (
		<ConfigRow
			left={
				<>
					<strong className="">Material ID</strong>
					<p className="text-muted mb-0">Show material ID next to name</p>
				</>
			}
			right={
				<Form.Switch
					checked={advancedPerks}
					onChange={e => {
						setAdvancedPerks(e.target.checked);
					}}
					id="alchemy-config-switch"
					label=""
				/>
			}
		/>
	);
};

const DarkMode = () => {
	const [theme, setTheme] = useContext(ThemeContext);
	return (
		<ConfigRow
			left={
				<>
					<strong className="">Dark Mode</strong>
				</>
			}
			right={
				<DarkModeToggle
					onChange={checked => {
						setTheme(checked ? 'dark' : 'light');
					}}
					checked={theme === 'dark'}
					size={60}
				/>
			}
		/>
	);
};

interface IPanelToggleProps {
	id: string;
	title: string;
}
const PanelToggle = (props: IPanelToggleProps) => {
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

export const Settings = props => {
	return (
		<Modal size="lg" show={props.show} onHide={props.handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Settings</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ConfigTitle
					title="General"
					subtitle="These settings modify how Noitool behaves or displays things."
				/>
				<ListGroup variant="flush" className="mb-5 shadow">
					<ListGroup.Item>
						<Locale />
					</ListGroup.Item>
					<ListGroup.Item>
						<DarkMode />
					</ListGroup.Item>
					<ListGroup.Item>
						<AlchemyConfig />
					</ListGroup.Item>
				</ListGroup>
				<hr className="my-4" />
				<ConfigTitle
					title="Panels"
					subtitle="Choose which info panels you want to see."
				/>
				<ListGroup variant="flush" className="mb-5 shadow">
					<ListGroup.Item>
						<PanelToggle key="alchemy" id="alchemy" title="Alchemy" />
					</ListGroup.Item>
					<ListGroup.Item>
						<PanelToggle key="biome" id="biome" title="Biome" />
					</ListGroup.Item>
					<ListGroup.Item>
						<PanelToggle key="fungal" id="fungal" title="Fungal Shifts" />
					</ListGroup.Item>
					<ListGroup.Item>
						<PanelToggle
							key="holy-mountain"
							id="holy-mountain"
							title="Holy Mountain"
						/>
					</ListGroup.Item>
					<ListGroup.Item>
						<PanelToggle key="rain" id="rain" title="Rain" />
					</ListGroup.Item>
					<ListGroup.Item>
						<PanelToggle key="start" id="start" title="Starting Setup" />
					</ListGroup.Item>
				</ListGroup>
			</Modal.Body>
		</Modal>
	);
};
