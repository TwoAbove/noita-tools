import React from 'react';

// const backgroundUri =
// 	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAABnRSTlMAAAAAAABupgeRAAAAbklEQVR4nO3VsREAIQgEwPO1EGvAFizFsmiJHsykjA+c0eSTh5SLINm5CBIAAK01WCMiAMpWxhhmaFvZrxCRqpazM7NBOSUuVGv9q8w5z/wYWnwmoIACCsiZe9h67x4or7VUlYjMBDOLSNqL/x29xrsggrMs4OkAAAAASUVORK5CYII=';

const backgroundUri =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALAgMAAADUwp+1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAlQTFRFAAAAMR0dNycksaREGAAAAAN0Uk5TAP//RFDWIQAAABpJREFUeJxjEFsVwJC1agkYr1q1AgPD5IDqAJ8xEu2sZzdJAAAAAElFTkSuQmCC';

interface IIconProps {
	uri: string;
	size?: string;
	background?: boolean;
}

const Icon = (
	props: IIconProps &
		React.DetailedHTMLProps<
			React.ImgHTMLAttributes<HTMLImageElement>,
			HTMLImageElement
		>
) => {
	const { uri, width, height, style, size, background, ...rest } = props;

	const img = (
		<img
			{...rest}
			alt={rest.alt}
			title={rest.title}
			src={uri}
			style={{
				width: size || width || '3rem',
				height: size || height,
				imageRendering: 'pixelated',
				...style
			}}
		/>
	);

	if (background) {
		return (
			<div
				style={{
					padding: '0px',
					width: size || width || '3rem',
					height: size || height,
					backgroundImage: `url(${backgroundUri})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					imageRendering: 'pixelated'
				}}
			>
				{img}
			</div>
		);
	}
	return img;
};

export default Icon;
