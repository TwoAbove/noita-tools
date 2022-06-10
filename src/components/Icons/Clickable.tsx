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

	// Clicked-style is prioritised, then hovered-style, otherwise fallback to default style.
	const clickedOrHoveredStyle = clicked ? 'bg-info' : hovered ? 'bg-light' : 'bg-body'

	return (
		<div
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{
				cursor: 'pointer'
			}}
			className={classNames('p-1', clickedOrHoveredStyle)}
		>
			{childrenWithProps}
		</div>
	);
};

export default Clickable;
