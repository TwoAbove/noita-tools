import React, { useEffect, useRef, useState } from 'react';
import { Col } from 'react-bootstrap';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import {
	copyImage,
	imageToBase64
} from '../../../services/imageActions/webImageActions';
import { useContainerDimensions } from '../../helpers';

interface IMapProps {
	infoProvider: GameInfoProvider;
	mapPart: keyof typeof mapParts;
	worldOffset: number;
	// seed: string;
	// worldOffset?: number;
	// xOffset?: number;
	// yOffset?: number;
	// iter?: number;
}

const mapParts = {
	FullMap: {
		xr: new Array(70).fill('').map((_, i) => i),
		yr: new Array(48).fill('').map((_, i) => i)
	},
	MainPath: {
		xr: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
		yr: [
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20,
			21,
			22,
			23,
			24,
			25,
			26,
			27,
			28,
			29,
			30,
			31,
			32,
			33,
			34,
			35,
			36,
			37,
			38,
			39
		]
	},
	other: {
		xr: [26],
		yr: [14]
	},
	other2: {
		xr: [35],
		yr: [15]
	},
	top2: {
		xr: [31, 32, 33, 34, 35, 36, 37, 38],
		yr: [14, 15, 16, 17, 18]
	},
	vaultFrozen: {
		xr: [12, 13, 14, 15, 16, 17, 18],
		yr: [15, 16, 17, 18, 19]
	},
	liquidcave: {
		xr: [26, 27, 28, 29, 30],
		yr: [14, 15]
	},
	coalmine_min: {
		xr: [36],
		yr: [14]
	},
	coalmine_alt: {
		xr: [32, 33],
		yr: [15]
	},
	coalmines: {
		xr: [32, 33, 34, 35, 36, 37, 38],
		yr: [14, 15]
	},
	coalmine: {
		xr: [34, 35, 36, 37, 38],
		yr: [14, 15]
	},
	excavationSite: {
		xr: [31, 32, 33, 34, 35, 36, 37, 38],
		yr: [17, 18]
	},
	snowCave: {
		xr: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
		yr: [20, 21, 22]
	},
	Snowcastle: {
		xr: [31, 32, 33, 34, 35, 36, 37],
		yr: [24, 25]
	},
	Jungle: {
		xr: [30, 31, 32, 33, 34, 35, 36, 37, 38],
		yr: [27, 28, 29]
	},
	coalmineTower: {
		xr: [53, 54, 55],
		yr: [31]
	},
	fungiforest: {
		xr: [58, 59, 60, 61],
		yr: [35, 36, 37, 38, 39, 40]
	},
	vault: {
		xr: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
		yr: [31, 32, 33]
	},
	vaultFungal: {
		xr: [39],
		yr: [31]
	},
	Watercave: {
		xr: [31],
		yr: [15]
	},
	holyMountain: {
		xr: [32, 33, 34, 35, 36, 37, 38],
		yr: [16]
	}
};

const { xr, yr } = mapParts.MainPath;
// const { xr, yr } = mapParts.coalmine;
// const xr = new Array(70).fill(1).map((_, i) => i);
// const yr = new Array(48).fill(1).map((_, i) => i);

// const xr = [29, 30,31, 32,33,34,35,36,37,38, 39];
// const yr = [31, 32, 33];
interface ITileProps {
	cvs: OffscreenCanvas;
	x: number;
	y: number;
	worldseedOffset?: number;
}
export const Tile = (props: ITileProps) => {
	const { cvs, x, y, worldseedOffset = 0 } = props;
	const [src, setSrc] = useState<string | undefined>();
	useEffect(() => {
		if (!cvs) {
			return;
		}
		const work = async () => {
			const d = await imageToBase64(cvs.transferToImageBitmap());
			setSrc(d);
		};
		work().catch(e => console.error(e));
	}, [cvs]);
	// return cvs
	return (
		<img
			style={{
				width: '512px',
				height: '512px',
				// width: "10rem",
				// height: "10rem",
				// width: `300%`,
				imageRendering: 'pixelated'
			}}
			alt=""
			title={`${x},${y} - ${worldseedOffset}`}
			src={src}
		/>
	);
};

// Name collision with js Map
const MapComponent = (props: IMapProps) => {
	const { infoProvider, mapPart } = props;
	const seed = infoProvider.config.seed;
	const componentRef = useRef<HTMLDivElement>(null);
	const { width, height } = useContainerDimensions(componentRef);

	const { xr, yr } = mapParts[mapPart];

	const [images, setImages] = useState<Map<string, OffscreenCanvas>>();

	useEffect(() => {
		console.profile('Map');
		try {
			const res = new Map<string, OffscreenCanvas>();
			for (const y of yr) {
				for (const x of xr) {
					const mapData = infoProvider.providers.map.provide(
						x,
						y,
						infoProvider.config.seed
					);
					if (!mapData) {
						continue;
					}
					// console.log(mapData);
					const cvs = copyImage(mapData.map);
					// console.log(x, y, mapData.interestPoints);
					res.set(`${x}-${y}`, cvs);
				}
			}
			setImages(res);
		} catch (e) {
			console.error(e);
		}
		console.profileEnd('Map');
	}, [infoProvider, xr, yr]);

	if (!images) {
		return <div>loading</div>;
	}

	return (
		<div ref={componentRef} className="flex-nowrap justify-content-center">
			{yr.map(y => {
				return (
					<div className="row flex-nowrap" key={y + seed}>
						{xr.map(x => {
							const key = `${x}-${y}`;
							const image = images!.get(`${x}-${y}`)!;
							return (
								<Col xs="auto" className="p-0 m-0" key={key + seed}>
									<Tile cvs={image} x={x} y={y} />
								</Col>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default MapComponent;
