import React from 'react';

interface IIconProps {
	uri: string;
	size?: string;
}

const Icon = (props: IIconProps & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
	const { uri, width, height, style, size, ...rest } = props;

	return (
		<img
			{...rest}
			alt={rest.alt}
			title={rest.title}
			src={uri}
			style={{ width: size || width || '3rem', height: size || height, imageRendering: 'pixelated', ...style }}
		/>
	);
};

export default Icon;
