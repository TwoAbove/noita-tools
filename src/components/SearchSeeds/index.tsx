import { Suspense, lazy } from "react";

import LoadingComponent from "../LoadingComponent";

const L = lazy(() => import("./SearchSeeds"));

const LazySearchSeeds = props => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <L {...props} />
    </Suspense>
  );
};

export default LazySearchSeeds;
