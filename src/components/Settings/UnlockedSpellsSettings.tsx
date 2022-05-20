import { ListGroup, Form, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { SpellInfoProvider } from '../../services/SeedInfo/infoHandler/InfoProviders/Spell';
import useLocalStorage from '../../services/useLocalStorage';
import Icon from '../Icons/Icon';

import { ConfigRow, ConfigTitle, DropZone } from './helpers';

const spellInfoProvider = new SpellInfoProvider({} as any);

const flags = spellInfoProvider.spellsArr.reduce((c, r) => {
	if (!r.spawn_requires_flag) {
		return c;
	}
	if (c[r.spawn_requires_flag]) {
		c[r.spawn_requires_flag].push(r.id);
	} else {
		c[r.spawn_requires_flag] = [r.id];
	}
	return c;
}, {});
const flagNames = Object.keys(flags);

const setFlagArr = (spells: typeof spellInfoProvider['spellsArr'], unlockedSpells: boolean[], val: boolean) => {
	const indexes = spells.map(spell =>
		spellInfoProvider.spellsArr.findIndex(s => s.id === spell.id)
	);
	const newUnlockedSpells = [...unlockedSpells];
	for (const i of indexes) {
		newUnlockedSpells[i] = val;
	}
	return newUnlockedSpells;
};

const FlagToggle = (props: { flag: string }) => {
	const { flag } = props;

	const [unlockedSpells, setUnlockedSpells] = useLocalStorage(
		'unlocked-spells',
		Array(393).fill(true)
	);
	const { t } = useTranslation('materials');

	const spells = spellInfoProvider.spellsArr.filter(
		s => s.spawn_requires_flag === flag
	);

	let unlocked = false;
	for (const spell of spells) {
		const i = spellInfoProvider.spellsArr.findIndex(s => s.id === spell.id)
		if (!unlockedSpells[i]) {
			unlocked = false;
			continue;
		}
		unlocked = true;
	}

	const handleChecked = (checked: boolean) => {
		setUnlockedSpells(setFlagArr(spells, unlockedSpells, checked));
	};

	return (
		<ConfigRow
			left={
				<Stack direction="horizontal" gap={2}>
					{spells.map(spell => (
						<Icon
							key={spell.name}
							uri={spell.sprite}
							alt={t(spell.description)}
							title={t(spell.name)}
							background
						/>
					))}
				</Stack>
			}
			right={
				<Form.Switch
					checked={unlocked}
					onChange={e => {
						handleChecked(e.target.checked);
					}}
					id={`unlocked-spells-${flag}`}
					label=""
				/>
			}
		/>
	);
};

const UnlockedSpellsSettings = () => {
	const [, setUnlockedSpells] = useLocalStorage(
		'unlocked-spells',
		Array(393).fill(true)
	);
	const onDrop = (acceptedFiles: File[]) => {
		let newUnlockedSpells = Array(393).fill(true);
		const notFoundFlags = flagNames.filter(f => -1 === acceptedFiles.findIndex(file => file.name === f));
		for (const flag of notFoundFlags) {
			const spells = spellInfoProvider.spellsArr.filter(
				s => s.spawn_requires_flag === flag
			);
			newUnlockedSpells = setFlagArr(spells, newUnlockedSpells, false)
		}
		setUnlockedSpells(newUnlockedSpells);
	};

	return (
		<>
			<ConfigTitle
				title="Unlocked Spells"
				subtitle={
					<>
						Set which spells you have unlocked. This will make spells generated
						everywhere accurate.
						<br />
						It's possible to automatically import this if you have access to you
						save folder. To do this, select the following folder from your
						computer:{' '}
						<code>..\LocalLow\Nolla_Games_Noita\save00\persistent\flags</code>
						<br />
						<br />
						<DropZone onDrop={onDrop} />
					</>
				}
			/>
			<ListGroup variant="flush" className="mb-5 shadow">
				{flagNames.map(flag => {
					return (
						<ListGroup.Item key={flag}>
							<FlagToggle flag={flag} />
						</ListGroup.Item>
					);
				})}
			</ListGroup>
		</>
	);
};

export default UnlockedSpellsSettings;
