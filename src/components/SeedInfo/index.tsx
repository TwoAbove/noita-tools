import { Suspense, lazy } from "react";

import LoadingComponent from "../LoadingComponent";

const L = lazy(() => import("./SeedData"));

const LazySeedInfo = props => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <L {...props} />
    </Suspense>
  );
};

export default LazySeedInfo;
