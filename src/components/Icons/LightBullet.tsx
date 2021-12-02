import React from 'react';

const uri =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsUlEQVR4Ae3BMQrCMBQG4D9aiJNLt5xChw49QE/QrZOzW3AUoYFip+ItMhTe5uYFepJsLgGHgPCM0EGKg4vg4Pfh79eR9owJ0p7xYo43SHvuh9b0Q2ucDbwrD3VHjXE28GqzwHa9rztqDKIZRqQ9Y5RnEqQ9OxtYVVKkRQJnA6dFguvlDlVJ4WxgRAITzgZWlRSInA2cFgnOxxvyTOJJVVKQ9lyelgKfcDYwItKe8fcdD82ESKVNAKnEAAAAAElFTkSuQmCC';

const LightBulletIcon = (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
	const { ...rest } = props;
	return (
			<img
				{...rest}
				alt="Light_Bullet"
				src={uri}
				style={{ width: '3rem', imageRendering: 'crisp-edges' }}
			/>
	);
};

export default LightBulletIcon;
