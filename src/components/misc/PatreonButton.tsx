const PatreonButton = props => {
	return (
		<a
			className="btn btn-outline-primary btn-sm"
			href="https://www.patreon.com/bePatron?u=91627284"
			target="_blank"
			rel="noreferrer"
			style={{
				alignItems: 'center',
				backgroundColor: '#f1465a',
				border: props.border ? '1px solid white' : 'none',
				borderRadius: '0.5rem',
				color: 'rgb(255, 255, 255)',
				cursor: 'pointer',
				display: 'inline-flex',
				fontFamily: 'system-ui, Roboto, sans-serif',
				fontSize: '12px',
				fontWeight: 500,
				justifyContent: 'center',
				lineHeight: '12px',
				maxHeight: '32px',
				minHeight: '32px',
				outlineColor: 'rgb(255, 255, 255)',
				outlineOffset: '0px',
				outlineStyle: 'none',
				outlineWidth: '0px',
				paddingBottom: '0px',
				paddingLeft: '12px',
				paddingRight: '16px',
				paddingTop: '0px',
				position: 'relative',
				textDecorationColor: 'rgb(255, 255, 255)',
				textDecorationLine: 'none',
				textDecorationStyle: 'solid',
				textDecorationThickness: 'auto',
				transitionDelay: '0s',
				transitionDuration: '0.3s',
				transitionProperty: 'all',
				transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)',
				whiteSpace: 'normal',
				width: '11rem'
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					columnGap: '4px',
					visibility: 'visible',
					padding: '0px',
					margin: 'auto 0px'
				}}
			>
				<div
					style={{
						display: 'inline-block',
						width: '1rem'
					}}
				>
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M6 3H3v18h3V3zm8.5 13a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z"
						></path>
					</svg>
				</div>
				<div>
					<span style={{ marginLeft: '0.5rem' }}>Become a patron</span>
				</div>
			</div>
		</a>
	);
};

export default PatreonButton;
