import React from 'react';
import GameInfoProvider from '../../../services/SeedInfo/infoHandler';

interface IRainProps {
	rainData: { isRaining: boolean, material: string, probability: number }
	infoProvider: GameInfoProvider;
}

const Rain = (props: IRainProps) => {
	const { isRaining, material, probability } = props.rainData;
	return (
		<div className='d-flex justify-content-between align-items-center text-center p-3'>
			{isRaining ? <div>
				<p>It's raining {material}</p> with a probability of {Math.round(probability * 1000) / 10}%
			</div> : <div>
				<p>It's not raining</p>
			</div>}
		</div>
	);
};

export default Rain;
