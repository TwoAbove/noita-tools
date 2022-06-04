import { mean } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Col } from 'react-bootstrap';

import GameInfoProvider from '../../../services/SeedInfo/infoHandler';
import { copyImage } from '../../LiveSeedStats/OCRHandler/imageActions';

interface IMapProps {
	infoProvider: GameInfoProvider;
	seed: string;
}

// const xr = new Array(70).fill('').map((_, i) => i);
// const yr = new Array(40).fill('').map((_, i) => i);

// const xr = [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39];
// const yr = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const xr = [30];
const yr = [17];

interface ITileProps {
	cvs: HTMLCanvasElement;
	x: number;
	y: number;
}
const Tile = (props: ITileProps) => {
	const { cvs, x, y } = props;
	// return cvs
	return (
		<img
			style={{
				width: `300%`,
				imageRendering: 'pixelated',
			}}
			// alt={}
			title={`${x},${y}`}
			src={cvs?.toDataURL()}
		/>
	);
};

// Name collision with js Map
const MapComponent = (props: IMapProps) => {
	const { infoProvider, seed } = props;

	const [images, setImages] = useState<Map<string, HTMLCanvasElement>>();
	const [imageWidth, setImageWidth] = useState(64);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		(async () => {
			const res = new Map<string, HTMLCanvasElement>();
			const widths: number[] = [];
			for (const x of xr) {
				for (const y of yr) {
					const mapData = await infoProvider.providers.map.provide(x, y, seed);
					if (!mapData) {
						continue;
					}
					widths.push(mapData?.width);
					const cvs = copyImage(mapData);

					res.set(`${x}-${y}`, cvs);
				}
			}
			setImageWidth(mean(widths))
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
					<div className="row flex-nowrap" key={y + seed}>
						{xr.map(x => {
							const key = `${x}-${y}`;
							const image = images!.get(`${x}-${y}`)!;
							return (
								<Col xs='auto' className="p-0 m-0" key={key + seed}>
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
