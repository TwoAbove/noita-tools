import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Row, Form, Stack } from 'react-bootstrap';
import 'image-capture';

// import VideoViewer from './VideoViewer';
// import ImageBitmapViewer from './ImageBitmapViewer';
import OCRHandler from './OCRHandler/index';

import SeedDataOutput from '../RecipesForSeed/SeedDataOutput';
import SeedLinkHandler from './SeedLinkHandler';

// const ocrHandler = new OCRHandler({});

const Description = () => {
	return (
		<div>
			<h5>
				Host
			</h5>
			<p>
				This will allow you to get seed information (like from <i>Recipes For Seed</i>) in real time by reading the
				seed from your display during gameplay. Display data does not leave your machine.<br/><br/>
				To start, open this page in your browser and start the game. Click "Start screen capture". Select the Noita window, or the whole screen where Noita will be running
				if the former is not available.
			</p>
			<p>Currently, only English localization is supported, but there are plans to make it language-agnostic</p>
			<p>Input the code below on any other windows that you want your seed information to show up. (You can even share it!)</p>
			<p></p>
		</div>
	);
};

interface IHostProps {
	ready: boolean;
	recording: boolean;
	hostRoom?: string;
	onClickStartHosting: () => void;
	onClickStopHosting: () => void;
}

const Host = (props: IHostProps) => {
	const { ready, hostRoom, recording, onClickStartHosting, onClickStopHosting } = props
	return (
		<Stack gap={1}>
			<Description />
			{!recording ?
				<Button disabled={!ready} onClick={() => onClickStartHosting()}>
					Start screen capture
				</Button>
				:
				<Button disabled={!ready} onClick={() => onClickStopHosting()}>
					Stop screen capture
				</Button>
			}
			{recording ? <div>Recording</div> : null}
			{hostRoom ? <div><h3>Use the code {hostRoom}</h3></div> : null}
		</Stack>
	)
}

interface IWatchProps {
	ready: boolean;
	room?: string;
	onSetRoom: (room: string) => void;
	seed?: string;
}
const Watch = (props: IWatchProps) => {
	const { onSetRoom, seed, room } = props;

	const formRef = useRef(null);

	const [val, setVal] = useState('');

	const handleChange = (e: any) => {
		if (e.target.validity.valid) {
			setVal(e.target.value);
		}
		else if (val === '' || val === '-') {
			setVal(val);
		}
	};

	return (
		<Container>
			<Row>
				<h5>
					Watch
				</h5>
			</Row>
			<Row>
				<Form ref={formRef} onSubmit={(e) => {
					e.preventDefault();
					onSetRoom((e.target as any).elements.code.value);
				}}>
					<Row className="align-items-end">
						<Form.Group as={Col} xs={12} sm={12} md={9} controlId="code">
							<Form.Label>Enter code to track</Form.Label>
							<Form.Control onChange={handleChange} value={val} size="lg" type="tel" pattern="[0-9]*" placeholder="Code" />
						</Form.Group>
						<Col xs={12} sm={4} md={3} className="pt-2">
							<Button className="mb-1" variant="primary" type="submit">Connect</Button>
						</Col>
					</Row>
				</Form>
			</Row>
			{room ? <p className="mt-2 text-success">Connected to {room}</p> : null}
			{seed ? <SeedDataOutput seed={seed} /> : null}
		</Container>
	)
}

const LiveSeedStats = () => {
	// We need a way for the OCR handler to notify of a state change.
	// Maybe refactoring this is the way to go, but I'm not sure how to
	// make it simpler?
  // const canvasRef = useRef(null);

	const [, updateState] = useState<any>();
	const [lastSeed, setLastSeed] = useState<string>();
	const forceUpdate = useCallback(() => updateState({}), []);

	const [ocrHandler, setOcrHandler] = useState<OCRHandler>();
	const [seedLink, setSeedLink] = useState<SeedLinkHandler>();
	useEffect(() => {
		const ocrHandler = new OCRHandler({
			// canvasRef
		});
		ocrHandler.onUpdate = forceUpdate;
		ocrHandler.addEventListener('seed', event => {
			if (event.detail.seed) {
				setLastSeed(event.detail.seed);
				seedLink!.sendSeed(event.detail.seed);
			}
			// console.log('seed', event.detail.seed);
		});
		setOcrHandler(ocrHandler);
	}, [seedLink, forceUpdate]);
	useEffect(() => {
		const seedLinkHandler = new SeedLinkHandler({});
		seedLinkHandler.addEventListener('update', () => {
			forceUpdate()
		});
		setSeedLink(seedLinkHandler);
	}, [setSeedLink, forceUpdate]);

	const onClickScannerStart = async () => {
		await ocrHandler?.startCapture({});
		await seedLink?.host();
	};
	const onClickScannerStop = async () => {
		await ocrHandler?.stopCapture();
	};

	const ocrReady = Boolean(ocrHandler?.ready);
	const socketReady = Boolean(seedLink?.ready);

	const everythingReady = ocrReady && socketReady;

	return (
		<Container className="container shadow-lg">
			{/* <canvas style={{}} ref={canvasRef} /> */}
			<h4>Live seed data</h4>
			{!everythingReady ? <div>Loading...</div> :
				<Stack>
					<Col className="mb-5" xs={12}>
						<Watch ready={socketReady} room={seedLink?.room} onSetRoom={(room) => seedLink?.joinRoom(room)} seed={lastSeed || seedLink?.seed} />
					</Col>
					<Col className="mb-2" xs={12}>
						<Host ready={everythingReady} hostRoom={seedLink?.hostRoom} recording={!!ocrHandler?.mediaStream} onClickStartHosting={onClickScannerStart} onClickStopHosting={onClickScannerStop} />
					</Col>
				</Stack>
			}
		</Container>
	);
};

export default LiveSeedStats;
