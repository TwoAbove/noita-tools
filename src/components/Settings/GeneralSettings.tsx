import { useState, useContext } from 'react';
import { ListGroup, Form } from 'react-bootstrap';
import DarkModeToggle from 'react-dark-mode-toggle';

// import { db } from "../services/db";
import i18n from '../../i18n';

import { ThemeContext } from '../ThemeContext';
import { AlchemyConfigContext } from '../AlchemyConfigContext';
import { ConfigRow, ConfigTitle } from './helpers';

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
				<div className='m-1'>
					<DarkModeToggle
						onChange={checked => {
							setTheme(checked ? 'dark' : 'light');
						}}
						checked={theme === 'dark'}
						size={60}
					/>
				</div>
			}
		/>
	);
};

const GeneralSettings = () => {
	return (
		<>
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
		</>
	)
}

export default GeneralSettings;
