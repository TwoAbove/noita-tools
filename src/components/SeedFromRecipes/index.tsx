import React, { lazy, Suspense } from 'react';

import LoadingComponent from '../LoadingComponent';

const L = lazy(() => import('./SeedFromRecipes'));

const LazySeedFromRecipes = props => {
	return (
		<Suspense fallback={<LoadingComponent />}>
			<L {...props} />
		</Suspense>
	);
};

export default LazySeedFromRecipes;
