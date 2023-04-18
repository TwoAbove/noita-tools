import classNames from 'classnames';
import { useEffect, useState, useLayoutEffect } from 'react';

export const Square = props => {
	const { children, ...rest } = props;
	return (
		<div
			{...rest}
			style={{ width: 48, height: 48 }}
			className={classNames('d-flex align-items-center justify-content-center')}
		>
			{children}
		</div>
	);
};

export function useForceUpdate() {
	const [, setValue] = useState(0); // integer state
	return () => setValue(value => value + 1); // update the state to force render
}

export const useContainerDimensions = myRef => {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const getDimensions = () => ({
			width: myRef.current.offsetWidth,
			height: myRef.current.offsetHeight
		});

		const handleResize = () => {
			setDimensions(getDimensions());
		};

		if (myRef.current) {
			setDimensions(getDimensions());
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [myRef]);

	return dimensions;
};

export const useIsOverflow = (ref, callback?) => {
	const [isOverflow, setIsOverflow] = useState(false);

	useLayoutEffect(() => {
		const { current } = ref;

		const trigger = () => {
			const hasOverflow =
				current.scrollHeight > current.clientHeight ||
				current.scrollWidth > current.clientWidth;

			setIsOverflow(hasOverflow);

			if (callback) callback(hasOverflow);
		};

		if (current) {
			trigger();
		}
	}, [ref, callback]);

	return isOverflow;
};
