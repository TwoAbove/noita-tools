import { isEqual } from "lodash";
import { createContext, Suspense, useEffect, useState } from "react";

export type IPatreonData = {
  patreonId: string;
  noitoolId: string;
  userName: string;
  url: string;
  avatar: string;
  activePatron: boolean;

  resetDay: number;
  computeLeft: number;
  patreonComputeLeft: number;
  providedComputeLeft: number;
};

interface IProfileContext {
  patreonData: IPatreonData | null;
  patreonDataLoading: boolean;
  patreonDataError: boolean;
  handleLogout: () => void;
}

const ProfileContext = createContext<IProfileContext>({
  patreonData: null,
  patreonDataLoading: true,
  patreonDataError: false,
  handleLogout: () => {},
});

const ProfileProvider = props => {
  const [patreonData, setPatreonData] = useState<IPatreonData | null>(null);
  const [patreonDataLoading, setPatreonDataLoading] = useState(true);
  const [patreonDataError, setPatreonDataError] = useState(false);

  useEffect(() => {
    const fetchPatreonData = () =>
      fetch("/api/patreon/me")
        .then(async res => {
          if (res.status === 401) {
            return null;
          }
          try {
            const data = await res.json();
            if (!isEqual(data, patreonData)) {
              setPatreonData(data);
            }
          } catch (e) {
            setPatreonDataError(true);
            console.error(e);
          }
        })
        .finally(() => {
          setPatreonDataLoading(false);
        });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchPatreonData();

    if (!patreonData) {
      return;
    }

    const interval = setInterval(fetchPatreonData, 10000);

    return () => clearInterval(interval);
  }, [patreonData]);

  const handleLogout = () => {
    setPatreonDataLoading(true);
    fetch("/api/patreon/logout", {
      method: "POST",
    })
      .then(async res => {
        if (res.status === 401) {
          return null;
        }
        try {
          setPatreonData(null);
        } catch (e) {
          console.error(e);
        }
      })
      .finally(() => {
        setPatreonDataLoading(false);
      });
  };

  return (
    <ProfileContext.Provider
      value={{
        patreonData,
        patreonDataLoading,
        patreonDataError,
        handleLogout,
      }}
    >
      <Suspense fallback={<></>}>{props.children}</Suspense>
    </ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileProvider };
