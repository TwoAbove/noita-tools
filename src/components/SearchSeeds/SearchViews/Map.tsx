import React, { useState, useEffect, FC } from 'react';
import { Row, Col, Container, Form } from 'react-bootstrap';

import Clickable from '../../Icons/Clickable';
import { capitalize } from '../../../services/helpers';
import { IRule } from '../../../services/SeedInfo/infoHandler/IRule';
import { DropZone } from '../../Settings/helpers';

interface IMapSearchProps {
	onUpdateConfig: (config: Partial<IRule>) => void;
	config: IRule;
}

const mapConfig = {
	coalmine: {
		probability: 13,
		pos: {
			x: 34,
			y: 15
		},
		search: [
			'data/biome_impl/coalmine/physics_swing_puzzle.png',
			'data/biome_impl/coalmine/receptacle_oil.png',
			'data/biome_impl/coalmine/oiltank_puzzle.png'
		],
		funcs: ['load_pixel_scene2', 'load_pixel_scene', 'load_oiltank']
	},
	excavationSite: {
		probability: 991,
		pos: {
			x: 34,
			y: 17
		},
		search: [
			'data/biome_impl/excavationsite/meditation_cube.png',
			'data/biome_impl/excavationsite/receptacle_steam.png'
		],
		funcs: ['spawn_meditation_cube', 'load_pixel_scene4_alt']
	},
	snowCave: {
		probability: 3843,
		pos: {
			x: 34,
			y: 21
		},
		search: [
			'data/biome_impl/snowcave/receptacle_water.png',
			'data/biome_impl/snowcave/buried_eye.png'
		],
		funcs: ['load_pixel_scene', 'load_pixel_scene3']
	},
	snowCastle: {
		probability: 7120,
		pos: {
			x: 34,
			y: 25
		},
		search: ['data/biome_impl/snowcastle/kitchen.png'],
		funcs: ['load_pixel_scene2']
	},
	vault: {
		probability: 14700,
		pos: {
			x: 34,
			y: 31
		},
		search: ['data/biome_impl/vault/lab_puzzle.png'],
		funcs: ['load_pixel_scene2']
	}
};

const MapSearch: FC<IMapSearchProps> = ({ onUpdateConfig, config }) => {
	const { val } = config;

	const setMapConfig = newConfig => {
		onUpdateConfig({
			type: 'map',
			path: '',
			params: [],
			val: newConfig
		});
	};

	const handleFile = (file: File) => {
		file
			.text()
			.then(res => {
				const data = JSON.parse(res);
				setMapConfig(data);
			})
			.catch(e => {
				console.error(e);
			});
	};

	return (
		<Container fluid>
			<Row className="justify-content-evenly align-items-center">Enabled</Row>
			<Row className="justify-content-evenly align-items-center">
				<DropZone
					onDrop={files => {
						handleFile(files[0] as any);
					}}
				>
					<p>Drag 'n' drop the config.json here, or click to select in files</p>
				</DropZone>
				Current config:
				<pre>{JSON.stringify(val, null, 2)}</pre>
			</Row>
		</Container>
	);
};

export default MapSearch;
