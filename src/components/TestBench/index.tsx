import { lazy } from '@loadable/component'
import { Suspense } from 'react';
import LoadingComponent from '../LoadingComponent';

const L = lazy(() => import('./TestBench'));

const LazyLiveStats = props => {
	return (
		<Suspense fallback={<LoadingComponent />}>
			<L {...props} />
		</Suspense>
	);
};

export default LazyLiveStats;
