import React from 'react';

interface IImageBitmapViewerProps {
	bitmap?: ImageBitmap;
	canvasRef: React.RefObject<HTMLCanvasElement>;
}
const ImageBitmapViewer = (props: IImageBitmapViewerProps) => {
	const { canvasRef, bitmap, ...rest } = props;
	return <canvas ref={canvasRef} {...rest} />;
};
export default ImageBitmapViewer;
