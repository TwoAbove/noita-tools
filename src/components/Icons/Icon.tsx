import React from 'react';

interface IIconProps {
	uri: string;
}

const Icon = (props: IIconProps & React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
	const { uri, ...rest } = props;
	return (
		<img
			{...rest}
			alt={rest.alt}
			src={uri}
			style={{ width: '3rem', imageRendering: 'pixelated' }}
		/>
	);
};

export default Icon;
