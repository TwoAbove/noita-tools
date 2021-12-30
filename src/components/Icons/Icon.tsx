import React from 'react';

interface IIconProps {
	uri: string;
}

const Icon = (props: IIconProps & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
	const { uri, width, height, ...rest } = props;

	return (
		<img
			{...rest}
			alt={rest.alt}
			title={rest.title}
			src={uri}
			style={{ width: width || '3rem', height, imageRendering: 'pixelated' }}
		/>
	);
};

export default Icon;
