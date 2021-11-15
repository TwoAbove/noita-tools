import React, { lazy, Suspense } from 'react';

import LoadingComponent from '../LoadingComponent';

const L = lazy(() => import('./RecipesForSeed'));

const LazyRecipesForSeed = props => {
	return (
		<Suspense fallback={<LoadingComponent />}>
			<L {...props} />
		</Suspense>
	);
};

export default LazyRecipesForSeed;
