import { useState, useContext } from "react";
import { ListGroup, Form } from "react-bootstrap";
// import { DarkModeToggle } from "react-dark-mode-toggle-2";

// import { db } from "../services/db";
import i18n from "../../i18n";

import { ThemeContext } from "../ThemeContext";
import { AlchemyConfigContext } from "../AlchemyConfigContext";
import { ConfigRow, ConfigTitle } from "./helpers";
import useLocalStorage from "../../services/useLocalStorage";

const getFlagEmoji = countryCode =>
  String.fromCodePoint(...[...countryCode.toUpperCase()].map(x => 0x1f1a5 + x.charCodeAt()));

const flags = {
  de: "de",
  "en-US": "us",
  es: "es",
  fr: "fr",
  jp: "jp",
  ko: "kr",
  pl: "pl",
  pt: "pt",
  ru: "ru",
  "zh-CN": "cn",
};

const Locale = () => {
  const [l, sl] = useState(i18n.language);

  const setLocale = async lng => {
    await i18n.changeLanguage(lng);
    sl(lng);
  };

  return (
    <ConfigRow
      left={
        <>
          <strong className="">Locale</strong>
          <p className="text-muted fw-light mb-0">
            Change the localization on Noitool. Currently, only materials are translated.
          </p>
        </>
      }
      right={
        <Form.Select
          onChange={async e => {
            await setLocale(e.target.value);
          }}
          value={l}
          size="sm"
          aria-label="Locale"
          style={{
            width: "9rem",
          }}
        >
          {Object.keys(flags).map(l => (
            <option value={l} key={l}>
              {getFlagEmoji(flags[l])} {flags[l]}
            </option>
          ))}
        </Form.Select>
      }
    />
  );
};

const AlchemyConfig = () => {
  const [advancedPerks, setAdvancedPerks] = useContext(AlchemyConfigContext);
  return (
    <ConfigRow
      left={
        <>
          <strong className="">Material ID</strong>
          <p className="text-muted fw-light mb-0">Show material ID next to name</p>
        </>
      }
      right={
        <Form.Switch
          checked={advancedPerks}
          onChange={e => {
            setAdvancedPerks(e.target.checked);
          }}
          id="alchemy-config-switch"
          label=""
        />
      }
    />
  );
};

const LotteryPreview = () => {
  const [showInitialLottery, setShowInitialLottery] = useLocalStorage("show-initial-lottery", true);

  return (
    <ConfigRow
      left={
        <>
          <strong className="">Lottery Preview</strong>
          <p className="text-muted fw-light mb-0">
            If no lottery perks are selected, still show perk lottery chances for 1 lottery perk.
          </p>
        </>
      }
      right={
        <Form.Switch
          checked={showInitialLottery}
          onChange={e => {
            setShowInitialLottery(e.target.checked);
          }}
          id="alchemy-config-switch"
          label=""
        />
      }
    />
  );
};

export const ShowAlwaysCastRow = () => {
  const [showAlwaysCastRow, setShowAlwaysCastRow] = useLocalStorage("show-always-cast-row", false);

  return (
    <ConfigRow
      left={
        <>
          <strong className="">Show Always Cast for whole row</strong>
          <p className="text-muted fw-light mb-0">
            If there is an always cast perk in the row, show the potential always-cast for all perks in the row (as a
            solution to the reroll problem described in quirks).
          </p>
        </>
      }
      right={
        <Form.Switch
          checked={showAlwaysCastRow}
          onChange={e => {
            setShowAlwaysCastRow(e.target.checked);
          }}
          id="show-always-cast-row-config-switch"
          label=""
        />
      }
    />
  );
};

const DarkMode = () => {
  const [theme, setTheme] = useContext(ThemeContext);
  return (
    <ConfigRow
      left={
        <>
          <strong className="">Dark Mode</strong>
        </>
      }
      right={
        <div className="m-1">
          {/* <DarkModeToggle
            onChange={checked => {
              setTheme(checked ? "dark" : "light");
            }}
            isDarkMode={theme === "dark"}
            size={60}
          /> */}
          NOOP
        </div>
      }
    />
  );
};

const GeneralSettings = () => {
  return (
    <>
      <ConfigTitle title="General" subtitle="These settings modify how Noitool behaves or displays things." />
      <ListGroup variant="flush" className="mb-5 shadow">
        <ListGroup.Item>
          <Locale />
        </ListGroup.Item>
        <ListGroup.Item>
          <DarkMode />
        </ListGroup.Item>
        <ListGroup.Item>
          <AlchemyConfig />
        </ListGroup.Item>
        <ListGroup.Item>
          <LotteryPreview />
        </ListGroup.Item>
        <ListGroup.Item>
          <ShowAlwaysCastRow />
        </ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default GeneralSettings;
