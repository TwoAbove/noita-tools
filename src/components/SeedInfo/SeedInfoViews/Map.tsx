import React, { useEffect, useRef, useState } from 'react';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import { copyImage } from '../../LiveSeedStats/OCRHandler/imageActions';

interface IMapProps {
	infoProvider: GameInfoProvider;
	seed: string;
}

// const xr = new Array(70).fill('').map((_, i) => i);
// const yr = new Array(40).fill('').map((_, i) => i);

// const xr = [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38];
// const yr = [14, 15, 16, 17, 18, 19];
const xr = [35];
const yr = [14];

interface IMapPartProps {
	cvs: HTMLCanvasElement;
	x: number;
	y: number;
}
const MapPart = (props: IMapPartProps) => {
	const { cvs, x, y } = props;
	// return cvs
	return (
		<img
			style={{
				imageRendering: 'pixelated',
			}}
			alt={`${x} ${y}`}
			src={cvs?.toDataURL()}

		/>
	);
};

// Name collision with js Map
const MapComponent = (props: IMapProps) => {
	const { infoProvider, seed } = props;

	const [images, setImages] = useState<Map<string, HTMLCanvasElement>>();

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		(async () => {
			const res = new Map<string, HTMLCanvasElement>();
			for (const x of xr) {
				for (const y of yr) {
					const mapData = await infoProvider.providers.map.provide(x, y, seed);
					if (!mapData) {
						continue;
					}
					const cvs = copyImage(mapData);

					res.set(`${x}-${y}`, cvs);
				}
			}
			setImages(res);
		})();
	}, [infoProvider, seed, canvasRef]);

	if (!images) {
		return <div>loading</div>;
	}

	return (
		<div className="flex-nowrap justify-content-center">
			{yr.map(y => {
				return (
					<div className="row" key={y + seed}>
						{xr.map(x => {
							const key = `${x}-${y}`;
							const image = images!.get(`${x}-${y}`)!;
							return (
								<div className="col p-0 m-0" key={key + seed}>
									<MapPart cvs={image} x={x} y={y} />
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default MapComponent;
