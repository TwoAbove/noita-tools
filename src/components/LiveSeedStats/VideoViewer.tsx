import { useCallback, useState } from 'react';
import { Row } from 'react-bootstrap';

interface IMediaViewerProps {
	stream: MediaStream;
}
const MediaViewer = (props: IMediaViewerProps) => {
	const [node, setNode] = useState<HTMLVideoElement>();

	const refVideo = useCallback(
		(newNode: HTMLVideoElement) => {
			if (newNode) newNode.srcObject = props.stream;
			setNode(newNode);
		},
		[props.stream]
	);

	return (
		<Row>
			<video style={{ width: '50%' }} autoPlay ref={refVideo} {...props} />
		</Row>
	);
};

export default MediaViewer;
