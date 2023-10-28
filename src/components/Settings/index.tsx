import { Modal } from "react-bootstrap";

// import { db } from "../services/db";

import NeedInputAlert from "./NeedInput";
import GeneralSettings from "./GeneralSettings";
import PanelsSettings from "./PanelsSettings";
import SearchSettings from "./SearchSettings";
import DangerSettings from "./DangerSettings";
import FavoritesSettings from "./FavoritesSettings";
import UnlockedSpellsSettings from "./UnlockedSpellsSettings";
import { GameInfoContext, useGameInfoProvider } from "../SeedInfo/SeedDataOutput";

// TODO: All of these can be simplified to [</>,...].map for config values
// so that we don't repeat the settings blocks.
const settingsComponents = [
  GeneralSettings,
  PanelsSettings,
  SearchSettings,
  FavoritesSettings,
  UnlockedSpellsSettings,
  DangerSettings,
];

const Settings = props => {
  const [gameInfoProvider, data] = useGameInfoProvider("0");

  return (
    <Modal size="lg" show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {gameInfoProvider && data ? (
          <GameInfoContext.Provider value={{ gameInfoProvider, data }}>
            <NeedInputAlert />
            {settingsComponents.map((Component, index) => (
              <div key={index}>
                <Component />
                {index !== settingsComponents.length - 1 && <hr className="my-4" />}
              </div>
            ))}
          </GameInfoContext.Provider>
        ) : (
          <p>Loading</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Settings;
