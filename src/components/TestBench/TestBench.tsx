import { uniqueId } from 'lodash';
import { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import i18n from '../../i18n';
import GameInfoProvider from '../../services/SeedInfo/infoHandler';
import { SpellInfoProvider } from '../../services/SeedInfo/infoHandler/InfoProviders/Spell';
import { RuleType } from '../../services/SeedInfo/infoHandler/IRule';
import { SeedSearcher } from '../../services/seedSearcher';
import SeedSolver from '../../services/seedSolverHandler';
import useLocalStorage from '../../services/useLocalStorage';
import Icon from '../Icons/Icon';
import Spell from '../Icons/Spell';
import { useGameInfoProvider } from '../SeedInfo/SeedDataOutput';
import MapComponent from '../SeedInfo/SeedInfoViews/Map';
const seeds = [
	762394,
	4979830,
	11544858,
	13411336,
	13762161,
	14427260,
	19035578,
	21252149,
	28494122,
	29326086,
	30310405,
	31843383,
	34776924,
	36001562,
	37299328,
	39023639,
	41366879,
	41380954,
	42260623,
	42464831,
	44555666,
	47821460,
	47970749,
	49135136,
	52023783,
	55268174,
	56066069,
	58523193,
	61413380,
	65126248,
	66328828,
	69119238,
	69437725,
	79729390,
	83146747,
	88809163,
	91359080,
	92224094,
	103882806,
	103914591,
	103996162,
	107173530,
	111007607,
	115270187,
	115741383,
	116799106,
	121768699,
	128121499,
	128339275,
	132267985,
	132911126,
	133526349,
	135808405,
	136778895,
	140510585,
	142567372,
	149521812,
	159123189,
	163643264,
	164478929,
	165990765,
	168084975,
	169540482,
	172002111,
	181368738,
	182241227,
	182425577,
	186745831,
	189107105,
	191396464,
	198343846,
	200949994,
	208927430,
	209890558,
	219254063,
	223997324,
	219254063,
	223997324,
	227042599,
	227650718,
	229446360,
	233473764,
	233635156,
	237093943,
	237996220,
	242013739,
	243799864,
	249140421,
	252929068,
	255408773,
	257648118,
	263280088,
	266710115,
	267071467,
	270709653,
	273336963,
	277642608,
	284967161,
	287367950,
	298213737,
	298448347,
	299840293,
	299881725,
	300028174,
	304112317,
	311278970,
	311439032,
	319527103,
	329450832,
	329827865,
	334936496,
	341040169,
	359532139,
	363654749,
	364004485,
	365312272,
	365349758,
	374644140,
	378424156,
	381397358,
	382961875,
	385035998,
	396644303,
	403392452,
	404832215,
	411577481,
	415999102,
	422491446,
	426748200,
	427388928,
	429098384,
	431301544,
	433026351,
	436714955,
	441504043,
	442253266,
	451881014,
	452084118,
	453729583,
	454310193,
	456934155,
	461524351,
	464485998,
	466749775,
	467229017,
	469307544,
	470637002,
	471144676,
	473365757,
	481004377,
	485879473,
	487036623,
	495467334,
	495666864,
	498779140,
	501536656,
	502248611,
	502847503,
	503913278,
	504245762,
	509296834,
	512053480,
	515659337,
	520980776,
	523716932,
	531806142,
	540121818,
	540493819,
	540666489,
	541376751,
	544202881,
	547300177,
	552255783,
	553111741,
	553615648,
	555479514,
	557010337,
	558198723,
	566198858,
	567576081,
	568626434,
	574685794,
	575924746,
	580454170,
	581017048,
	584220053,
	585557448,
	587269493,
	598377977,
	602132245,
	607169572,
	608090816,
	611578849,
	614649128,
	614768193,
	617008478,
	620007134,
	626056192,
	629635472,
	632930078,
	640341455,
	641118463,
	651527258,
	659375610,
	660198712,
	675498188,
	679715516,
	685118982,
	685229894,
	686873163,
	689176379,
	691539314,
	695732347,
	695978921,
	696356400,
	705170166,
	708458968,
	711513941,
	713923435,
	718877357,
	719242289,
	721178597,
	725077178,
	726316023,
	726688687,
	727517466,
	737628392,
	738151492,
	739183182,
	741923111,
	744687936,
	747889078,
	748694712,
	754560498,
	758459195,
	759607807,
	762507577,
	764734235,
	769898938,
	774914530,
	778657914,
	778949055,
	779856796,
	782090609,
	784904431,
	786433191,
	786892543,
	789252359,
	789721895,
	791207305,
	798233909,
	801891633,
	802133124,
	810150364,
	810868196,
	817417098,
	819109786,
	819820757,
	819991303,
	820554234,
	831039688,
	831960801,
	833100974,
	843318195,
	843710081,
	844260958,
	844528103,
	855733633,
	856084226,
	857760450,
	860589418,
	866515045,
	866928722,
	867633185,
	870394470,
	879278682,
	881346327
];

interface ICSV {
	seed: number;
	link: string;
	map: string;
	mines_receptacle_oil: number; // for spreadsheet formatting
	mines_physics_swing_puzzle: number; // for spreadsheet formatting
	mines_oiltank_puzzle: number; // for spreadsheet formatting
	coal_pits_meditation_cube: number; // for spreadsheet formatting
	coal_pits_receptacle_steam: number; // for spreadsheet formatting
	snowcave_receptacle_water: number; // for spreadsheet formatting
	snowcave_buried_eye: number; // for spreadsheet formatting
	snowcastle_kitchen: number; // for spreadsheet formatting
	snowcastle_sauna: number; // for spreadsheet formatting
	vault_lab_puzzle: number; // for spreadsheet formatting
}

const places = {
	coalmines: [34, 15],
	excavationSite: [34, 17],
	snowCave: [34, 21],
	snowcastle: [34, 25],
	vault: [34, 31]
};

const compute = async (infoProvider: GameInfoProvider) => {
	await new Promise(res => setTimeout(res, 1000));
	// const seedSolver = new SeedSolver(1, false);
	const res: ICSV[] = [];
	for (const seed of seeds) {
		infoProvider.randoms.SetWorldSeed(seed);
		const coalminesData = infoProvider.providers.map.provide(
			places.coalmines[0],
			places.coalmines[1],
			seed.toString()
		);
		const excavationSiteData = infoProvider.providers.map.provide(
			places.excavationSite[0],
			places.excavationSite[1],
			seed.toString()
		);
		const snowCaveData = infoProvider.providers.map.provide(
			places.snowCave[0],
			places.snowCave[1],
			seed.toString()
		);
		const snowcastleData = infoProvider.providers.map.provide(
			places.snowcastle[0],
			places.snowcastle[1],
			seed.toString()
		);
		const vaultData = infoProvider.providers.map.provide(
			places.vault[0],
			places.vault[1],
			seed.toString()
		);

		res.push({
			seed,
			link: `https://dev.noitool.com/?seed=${seed}`,
			map: `https://dev.noitool.com/?seed=${seed}&map=true`,
			mines_receptacle_oil: Number(!!coalminesData?.interestPoints?.points?.find(p => p.item === 'data/biome_impl/coalmine/receptacle_oil.png')),
			mines_physics_swing_puzzle: Number(!!coalminesData?.interestPoints?.points?.find(p => p.item === '')),
			mines_oiltank_puzzle: Number(!!coalminesData?.interestPoints?.points?.find(p => p.item === '')),
			coal_pits_meditation_cube: Number(!!excavationSiteData?.interestPoints?.points?.find(p => p.item === 'data/biome_impl/excavationsite/meditation_cube.png')),
			coal_pits_receptacle_steam: Number(!!excavationSiteData?.interestPoints?.points?.find(p => p.item === 'data/biome_impl/excavationsite/receptacle_steam.png')),
			snowcave_receptacle_water: Number(!!snowCaveData?.interestPoints?.points?.find(p => p.item === 'data/biome_impl/snowcave/receptacle_water.png')),
			snowcave_buried_eye: Number(!!snowCaveData?.interestPoints?.points?.find(p => p.item === 'data/biome_impl/snowcave/buried_eye.png')),
			snowcastle_kitchen: Number(!!snowcastleData?.interestPoints?.points?.find(p => p.item === 'data/biome_impl/snowcastle/kitchen.png')),
			snowcastle_sauna: Number(!!snowcastleData?.interestPoints?.points?.find(p => p.item === 'data/biome_impl/snowcastle/sauna.png')),
			vault_lab_puzzle: Number(!!vaultData?.interestPoints?.points?.find(p => p.item === 'data/biome_impl/vault/lab_puzzle.png'))
		});
	}

	const csv = res.reduce((csv, row, i) => {
		if (i === 0) {
			csv += Object.keys(row).toString() + "\n";
		}
		csv += [
			row.seed,
			row.link,
			row.map,
			row.mines_receptacle_oil,
			row.mines_physics_swing_puzzle,
			row.mines_oiltank_puzzle,
			row.coal_pits_meditation_cube,
			row.coal_pits_receptacle_steam,
			row.snowcave_receptacle_water,
			row.snowcave_buried_eye,
			row.snowcastle_kitchen,
			row.snowcastle_sauna,
			row.vault_lab_puzzle,
		].toString() + "\n";
		return csv;
	}, '');

	console.log(csv);
};

const GameInfoProviderView = (props: { infoProvider: GameInfoProvider }) => {
	const { infoProvider } = props;

	const [worldOffset, setworldOffset] = useState(0);
	const [xOffset, setxOffset] = useState(0);
	const [yOffset, setyOffset] = useState(0);
	const [iter, setiter] = useState(1);
	return (
		<div>
			<Form.Control
				type="number"
				value={infoProvider.config.seed}
				onChange={e =>
					infoProvider.updateConfig({ seed: parseInt(e.target.value, 10) })
				}
				placeholder="world seed"
			/>
			<Form.Control
				type="number"
				value={worldOffset}
				onChange={e => setworldOffset(parseInt(e.target.value, 10) || 0)}
				placeholder="worldOffset"
			/>
			<Form.Control
				type="number"
				value={xOffset}
				onChange={e => setxOffset(parseInt(e.target.value, 10) || 0)}
				placeholder="xOffset"
			/>
			<Form.Control
				type="number"
				value={yOffset}
				onChange={e => setyOffset(parseInt(e.target.value, 10) || 0)}
				placeholder="yOffset"
			/>
			<Form.Control
				type="number"
				value={iter}
				onChange={e => setiter(parseInt(e.target.value, 10) || 0)}
				placeholder="iter"
			/>
			<Button onClick={() => compute(infoProvider)}>Test</Button>
			{/* <MapComponent
				xOffset={xOffset}
				yOffset={yOffset}
				iter={iter}
				worldOffset={worldOffset}
				infoProvider={infoProvider}
				seed={infoProvider.config.seed.toString()}
			/> */}
		</div>
	);
};

const TestBench = () => {
	// const seed = '1674055821';
	const seed = '762394';
	const [unlockedSpells] = useLocalStorage(
		'unlocked-spells',
		Array(393).fill(true)
	);
	const [gameInfoProvider] = useGameInfoProvider(seed, unlockedSpells);

	return (
		<Container>
			{!gameInfoProvider ? (
				<div>loading...</div>
			) : (
				<GameInfoProviderView infoProvider={gameInfoProvider} />
			)}
		</Container>
	);
};

export default TestBench;
