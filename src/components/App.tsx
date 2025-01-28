import React, { FC, useState, Suspense, useEffect, useContext, lazy } from "react";
import { Container, Stack, Button, Row, Modal } from "react-bootstrap";
import { useSearchParamsState } from "react-use-search-params-state";
import Cookies from "js-cookie";

import Donate from "./Donate";
import { isDev, isLocal } from "./utils";

import "./App.css";
import { ThemeProvider } from "./ThemeContext";
import { AlchemyConfigProvider } from "./AlchemyConfigContext";

import LoadingComponent from "./LoadingComponent";
import { db } from "../services/db";
import { BrowserRouter, useLocation, useSearchParams } from "react-router-dom";
import DBError from "./DBError";
import Patrons from "./Patrons";
import PatreonButton from "./misc/PatreonButton";
import { ProfileContext, ProfileProvider } from "./Profile/ProfileContext";

const Settings = lazy(() => import("./Settings"));
const LazySettings = () => {
  const [show, setShow] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [filterParams, setFilterParams] = useSearchParamsState({
    settings: {
      type: "boolean",
      default: false,
    },
  });

  const handleSettings = () => {
    if (!show) {
      setFilterParams({ settings: true });
      setShow(true);
    } else {
      // delete the param outright - I don't like settings=false in the url
      searchParams.delete("settings");
      setSearchParams(searchParams);
      setShow(false);
    }
  };

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Button onClick={() => handleSettings()} size="lg" variant="outline-primary">
        <i className="bi bi-gear"></i>
      </Button>
      <Settings show={show || filterParams.settings} handleClose={() => handleSettings()} />
    </Suspense>
  );
};

const Profile = lazy(() => import("./Profile"));
const LazyProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filterParams, setFilterParams] = useSearchParamsState({
    profile: {
      type: "boolean",
      default: false,
    },
  });

  const profileOpen = filterParams.profile;

  const { patreonData } = useContext(ProfileContext);

  const handleProfile = () => {
    if (!profileOpen) {
      setFilterParams({ profile: true });
    } else {
      // delete the param outright - I don't like profile=false in the url
      searchParams.delete("profile");
      setSearchParams(searchParams);
    }
  };

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Button onClick={() => handleProfile()} size="lg" variant="outline-primary">
        {patreonData?.avatar ? (
          <img
            src={patreonData.avatar}
            alt="profile"
            className="rounded-circle"
            style={{ width: "2rem", height: "2rem" }}
          />
        ) : (
          <i className="bi bi-person"></i>
        )}
      </Button>
      <Profile show={profileOpen} handleClose={() => handleProfile()} />
    </Suspense>
  );
};

const Header = () => {
  const isDevBranch = isDev() || isLocal();

  return (
    <Container fluid="sm" className="mb-2 p-0 d-flex justify-content-between px-2">
      <div className="text-nowrap lh-1">
        <h3 className="fs-1 fw-bolder mb-0 text-center position-relative pb-2">
          <a href="/" className="text-decoration-none text-reset">
            Noitool
            {isDevBranch && <sub className="fs-6 fw mb-0 text-center text-danger">Beta</sub>}
          </a>
          {isDevBranch && (
            <code
              className="fs-6 fw mb-0 position-absolute start-50 translate-middle-x"
              style={{
                bottom: "-0.25rem",
              }}
            >
              Build August 12 2024
            </code>
          )}
          {isDevBranch && <div />}
        </h3>
        <p className="fs-4 fw-light m-1 mt-0 my-1 text-center">Noita tools and helpers</p>
      </div>
      <div className=" d-flex pt-2 justify-content-end align-items-start">
        {/* <div className="mx-2">
          <LazyProfile />
        </div> */}
        <div className="mx-2">
          <LazySettings />
        </div>
      </div>
    </Container>
  );
};

const WasmError = (props: any) => {
  return (
    <div className="position-absolute top-50 start-50 translate-middle text-center w-75">
      <p>Looks like this browser does not support WebAssembly, which is needed to run the generation code.</p>
      <p>
        This might be due to several things. Some browser security configurations turn WebAssembly off. Some browsers do
        not support it. <br />
        One common issue is with Edge with enhanced security configuration turning off WebAssembly.
      </p>
      <p>
        Check{" "}
        <a href="https://webassembly.org/roadmap/" target="_blank" rel="noreferrer">
          this page
        </a>{" "}
        to see which browsers support it.
      </p>
      <p>If you are sure that this message is an error, click below.</p>
      <Button onClick={props.onProceed}>Continue</Button>
    </div>
    // <Container fluid="sm" className="mb-5 p-0 rounded shadow-lg">
    // </Container>
  );
};

const Body = lazy(() => import("./Body"));
const LazyBody = (props: any) => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Body {...props} />
    </Suspense>
  );
};

const Footer = () => {
  return (
    <footer className="footer font-small p-1 pt-3">
      <Stack>
        {/* <div className="d-flex justify-content-center align-items-center text-center">
          For a version of Noitool that follows&nbsp; <b>Noita beta</b>, check out&nbsp;
          <a href="https://dev.noitool.com/">dev.noitool.com</a>
        </div> */}
        <div className="d-flex justify-content-center align-items-center text-center">
          <PatreonButton />
          <div className="mx-2">or</div>
          <div className="pt-2">
            <Donate />
            <small className="text-wrap d-block fw-light lh-1" style={{ width: "12rem" }}>
              If you want to see your name below, please reach out!
            </small>
          </div>
        </div>
        <Patrons />
        <div className="footer text-center fw-light py-1">
          Ideas? Issues? Bugs? Click{" "}
          <a target="_blank" rel="noreferrer" href="https://github.com/TwoAbove/noita-tools/issues/">
            here
          </a>
          {/* <br /> */} or DM me on Noita's discord:{" "}
          <a target="_blank" rel="noreferrer" href="https://discord.gg/noita">
            twoabove
          </a>{" "}
          or send me an email: <a href="mailto:me@noitool.com">me@noitool.com</a>
        </div>
        <div className="footer-copyright text-center fw-light py-1">
          <span className="fw-bold">
            Noitool <code className="ms-1">{APP_VERSION} </code>
          </span>
          © 2025 <a href="https://seva.dev/">Seva Maltsev</a>
        </div>
      </Stack>
    </footer>
  );
};

interface IOutdatedVersionHandlerProps {
  children?: React.ReactNode;
}
const OutdatedVersionHandler: FC<IOutdatedVersionHandlerProps> = props => {
  const [outdated, setOutdated] = useState(false);

  useEffect(() => {
    fetch("/api/version")
      .then(r => r.json())
      .then(r => {
        if (r.outdated) {
          setOutdated(true);
        }
      });
  }, []);

  let toShow = <>{props.children}</>;

  if (outdated) {
    toShow = (
      <div className="position-absolute top-50 start-50 translate-middle text-center w-75 fs-4 fw-light">
        <p>
          Noita has received an update, and Noitool is not yet compatible with it. <br />
        </p>
        <p>
          It might take <code>a day or two</code> to update Noitool. <br />
          Thank you for your patience!
        </p>
        <p>If you want to proceed, click the button below.</p>
        <Button onClick={() => setOutdated(false)}>Continue</Button>
      </div>
    );
  }

  return toShow;
};

interface IDBErrorHandlerProps {
  children?: React.ReactNode;
}
const DBErrorHandler: FC<IDBErrorHandlerProps> = props => {
  const [hasDBError, setHasDBError] = useState<Error | boolean>(false);

  useEffect(() => {
    db.errorOnOpen
      .then(e => {
        setHasDBError(e);
      })
      .finally(() => {});
  }, []);

  let toShow = <>{props.children}</>;

  if (hasDBError) {
    toShow = <DBError error={hasDBError} onProceed={() => setHasDBError(false)} />;
  }

  return toShow;
};

const App: FC = () => {
  const [hasWasm, setHasWasm] = useState(() => {
    try {
      // https://github.com/MaxGraey/wasm-check/issues/5
      // return wasmCheck.support()
      return typeof WebAssembly === "object";
    } catch (e) {
      console.error(e);
      return false;
    }
  });

  // This is used to force update the app when we don't have a session token
  useEffect(() => {
    const noitoolSessionToken = Cookies.get("noitoolSessionToken");
    if (!noitoolSessionToken) {
      fetch("/api/session").finally(() => {
        // refresh the page
        window.location.reload();
      });
    }
  }, []);

  let toShow = <LazyBody />;

  if (!hasWasm) {
    toShow = <WasmError onProceed={() => setHasWasm(true)} />;
  }

  return (
    <OutdatedVersionHandler>
      <DBErrorHandler>
        <BrowserRouter>
          <div className="App bg-gradient">
            <div className="content bg-body rounded" style={{ minHeight: "85vh" }}>
              <ThemeProvider>
                <AlchemyConfigProvider>
                  <Header />
                  {toShow}
                </AlchemyConfigProvider>
              </ThemeProvider>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </DBErrorHandler>
    </OutdatedVersionHandler>
  );
};

export default App;
