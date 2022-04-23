/* eslint-disable @typescript-eslint/no-unused-vars */

import Clickable from './Clickable';
import Icon from './Icon';
import { useTranslation } from 'react-i18next';
import { PerkInfoProvider } from '../../services/SeedInfo/infoHandler/InfoProviders/Perk';

const lotteryPerk = new PerkInfoProvider({} as any).getPerk('PERKS_LOTTERY');

interface IPerkProps {
  rerollable?: boolean;
  clicked?: boolean;
  width?: string;
  perk: PerkInfoProvider['perksArr'][number];
  onClick?: () => void;
}

const Perk = (props: IPerkProps) => {
  const { clicked, rerollable, perk, width, onClick } = props;
	const [t] = useTranslation('materials');
  return (
    <div onClick={onClick} className='position-relative'>
      <Clickable
        clicked={clicked}
      >
        <Icon
          uri={perk.perk_icon}
          alt={t(perk.ui_description)}
          title={t(perk.ui_name)}
          width={width}
        />
        {rerollable &&
          <Icon
            className='position-absolute top-0 start-100 translate-middle'
            width='1.5rem'
            uri={`${lotteryPerk.perk_icon}`}
          />
        }
      </Clickable>
    </div>
  );
}

export default Perk;
