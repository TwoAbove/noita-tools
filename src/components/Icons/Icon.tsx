import classNames from 'classnames';
import React from 'react';

// const backgroundUri =
// 	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAABnRSTlMAAAAAAABupgeRAAAAbklEQVR4nO3VsREAIQgEwPO1EGvAFizFsmiJHsykjA+c0eSTh5SLINm5CBIAAK01WCMiAMpWxhhmaFvZrxCRqpazM7NBOSUuVGv9q8w5z/wYWnwmoIACCsiZe9h67x4or7VUlYjMBDOLSNqL/x29xrsggrMs4OkAAAAASUVORK5CYII=';

// const backgroundUri =
// 	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALAgMAAADUwp+1AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAlQTFRFAAAAMR0dNycksaREGAAAAAN0Uk5TAP//RFDWIQAAABpJREFUeJxjEFsVwJC1agkYr1q1AgPD5IDqAJ8xEu2sZzdJAAAAAElFTkSuQmCC';

const backgroundUri =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAmklEQVQ4jWNgoDJghDEq3S3+w9hHXn6+bSPOq0osm4GBgaF95wlGuIGV7hb/j7z8fJsSl9mI86q27zzByMTAwMDw7OUXSsxiQDaDiWKT0AATAwMDwz2G/xR5F9kMJgYGiP8pNRBmBm3CcNTLZIFRLw92L//8/YdiA2FmwAvYCG0NeAH7lJX5tvTvv6rEshkYGBhWXL0BN4uqAAB3tmuIr9eIsgAAAABJRU5ErkJggg==';

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

	const w = size || width || '3rem';
	const h = size || height;

	const img = (
		<img
			className={classNames([
				background && 'position-absolute top-50 start-50 translate-middle'
			])}
			{...rest}
			alt={rest.alt}
			title={rest.title}
			src={uri}
			style={{
				width: w,
				height: h,
				imageRendering: 'pixelated',
				...style
			}}
		/>
	);

	if (background) {
		return (
			<div
				className="position-relative"
				style={{
					width: `calc(${w} + 10px)`,
					height: `calc(${h || '3rem'} + 10px)`,
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
