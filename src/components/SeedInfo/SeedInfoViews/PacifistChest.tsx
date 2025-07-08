import React, { FC } from 'react';
import Entity from '../../Icons/Entity';
import { IItem } from '../../../services/SeedInfo/infoHandler/InfoProviders/ChestRandom';

interface IPacifistChestProps {
  items: IItem[];
}

const PacifistChest: FC<IPacifistChestProps> = ({ items }) => {
  const goldReward = items.filter(r => r.entity.includes("goldnugget"));
  const nonGoldReward = items.filter(r => !r.entity.includes("goldnugget"));
  let goldSumm = goldReward.reduce<number>((c, r) => {
    // either goldnugget or goldnugget_x
    const gn = r.entity.split("/")[4].split(".")[0];
    if (gn === "goldnugget") {
      return c + 10;
    }
    const number = gn.replace("goldnugget_", "");
    return c + parseInt(number, 10);
  }, 0);
  return (
    <>
      {goldSumm > 0 && (
        <div className="d-flex m-2 flex-column align-content-center justify-content-center align-items-center">
          <Entity width="1rem" height="1rem" id="data/entities/items/pickup/goldnugget.xml" />
          {goldSumm}
        </div>
      )}
      {nonGoldReward.map((r, i) => (
        <Entity preview key={`${r.entity} - ${i}`} id={r.entity} entityParams={{ extra: r.extra, x: r.x, y: r.y }} />
      ))}
    </>
  );
};

export default PacifistChest;
export type { IPacifistChestProps };
