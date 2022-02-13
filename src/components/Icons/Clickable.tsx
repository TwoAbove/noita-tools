import classNames from 'classnames';
import React, { useState } from 'react';

export interface IClickableProps {
	clicked?: boolean;
	useHover?: boolean
	children: React.ReactNode;
}

const Clickable = (props: IClickableProps | any) => {
	const { clicked, useHover, children, ...rest } = props;
	const childrenWithProps = React.Children.map(children, child => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, { ...rest });
		}
		return child;
	});
	const [hovered, setHovered] = useState(false);

	const handleMouseEnter = e => {
		setHovered(true);
	};

	const handleMouseLeave = e => {
		setHovered(false);
	};

	const clickedStyles = clicked && 'border border-3 p-1 flex-shrink-1';
	// TODO need to get centering correct so that there is not jittering
	const hoverStyles = false && hovered && 'border';
	return (
		<div
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{
				cursor: 'pointer'
			}}
			className={classNames('', clickedStyles, hoverStyles)}
		>
			{childrenWithProps}
		</div>
	);
};

export default Clickable;
