import classNames from "classnames";

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
