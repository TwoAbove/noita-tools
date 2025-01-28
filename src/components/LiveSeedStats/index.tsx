import { Suspense, lazy } from "react";

import LoadingComponent from "../LoadingComponent";

const L = lazy(() => import("./LiveSeedStats"));

const LazyLiveStats = props => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <L {...props} />
    </Suspense>
  );
};

export default LazyLiveStats;
