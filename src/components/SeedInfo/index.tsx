import React, { Suspense } from 'react';
import { lazy } from '@loadable/component'

import LoadingComponent from '../LoadingComponent';

const L = lazy(() => import('./RecipesForSeed'));

const LazySeedInfo = props => {
	return (
		<Suspense fallback={<LoadingComponent />}>
			<L {...props} />
		</Suspense>
	);
};

export default LazySeedInfo;
