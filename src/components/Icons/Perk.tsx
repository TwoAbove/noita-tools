/* eslint-disable @typescript-eslint/no-unused-vars */

import Clickable from './Clickable';
import Icon from './Icon';
import { useTranslation } from 'react-i18next';
import { PerkInfoProvider } from '../../services/SeedInfo/infoHandler/InfoProviders/Perk';
import classNames from 'classnames';
import { SpellInfoProvider } from '../../services/SeedInfo/infoHandler/InfoProviders/Spell';

const lotteryPerk = new PerkInfoProvider({} as any).getPerk('PERKS_LOTTERY');

interface IPerkProps {
	className?: string | false;
	highlight?: boolean;
	rerollable?: boolean;
	alwaysCast?: string;
	clicked?: boolean;
	width?: string;
	perk: PerkInfoProvider['perksArr'][number];
	onClick?: () => void;
}

const spells = new SpellInfoProvider({} as any);

const Perk = (props: IPerkProps) => {
	const {
		className,
		clicked,
		rerollable,
		perk,
		width,
		highlight,
		alwaysCast,
		onClick
	} = props;
	const [t] = useTranslation('materials');

  const item = alwaysCast ? spells.provide(alwaysCast) : null;

	return (
		<div
			onClick={onClick}
			className={classNames(className, 'position-relative')}
		>
			<Clickable clicked={clicked}>
				<Icon
					className={classNames(highlight && 'shadow')}
					uri={perk.perk_icon}
					alt={t(perk.ui_description)}
					title={t(perk.ui_name)}
					width={width}
				/>
				{rerollable && (
					<Icon
						className="position-absolute top-0 start-100 translate-middle"
						width="1.5rem"
						uri={`${lotteryPerk.perk_icon}`}
					/>
				)}
				{alwaysCast && item && (
					<Icon
						className={classNames('position-absolute top-0 start-0 translate-middle', highlight && 'shadow')}
						width="1.2rem"
						uri={item.sprite}
						title={t(item.name)}
						background
					/>
				)}
			</Clickable>
		</div>
	);
};

export default Perk;
