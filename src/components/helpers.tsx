import classNames from "classnames";
import { useState } from "react";

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

export function useForceUpdate(){
	const [, setValue] = useState(0); // integer state
	return () => setValue(value => value + 1); // update the state to force render
}
