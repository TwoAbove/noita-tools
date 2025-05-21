import React, { FC } from 'react';
import { Button } from 'react-bootstrap';
import { Square } from '../../helpers'; // Assuming Square is a helper component
import WandIcon from '../../Icons/Wand';
import LightBulletIcon from '../../Icons/LightBullet';
import { IShopType } from '../../../services/SeedInfo/infoHandler/InfoProviders/Shop';

interface IShopComponentProps {
  type: IShopType;
  handleOpenShopInfo: () => void;
  favoriteSpells: string[]; // Assuming favoriteSpells is an array of strings (spell IDs)
}

const ShopComponent: FC<IShopComponentProps> = ({ type, handleOpenShopInfo, favoriteSpells }) => {
  const Icon = type === IShopType.wand ? WandIcon : LightBulletIcon;
  return (
    <Button
      className="position-relative"
      onClick={handleOpenShopInfo}
      variant={favoriteSpells.length ? "outline-info" : "outline-primary"}
      size="sm"
    >
      <Square>
        <Icon />
        {favoriteSpells.length ? <div className="position-absolute top-0 end-0 pe-1">{favoriteSpells.length}</div> : ""}
      </Square>
    </Button>
  );
};

export default ShopComponent;
export type { IShopComponentProps };
