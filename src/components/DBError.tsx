import { useState } from "react";
import { Button } from "react-bootstrap";

import "./App.css";

import classNames from "classnames";
import SyncHandler from "./Settings/SyncHandler";

const DBError = props => {
  const [uuid, setUUID] = useState("(available after upload)");
  const [uploaded, setUploaded] = useState(false);
  const [syncHandler] = useState(() => new SyncHandler());
  const handleUpload = async () => {
    const id = await syncHandler.sendToDebug();
    setUUID(id);
    setUploaded(true);
  };
  return (
    <div className="position-absolute top-50 start-50 translate-middle">
      <p>
        There was an error loading the database: <br />
        <code>Error: {props.error.message}</code>
      </p>
      <p>
        <b>This might be due to several reasons:</b>
        <ul>
          <li>
            A common issue might be the use of Noitool in <b>incognito mode</b>.
          </li>
          <li>Some browser's security configuration does not allow indexeddb access.</li>
          <li>
            In a very rare case, your browser might not support indexeddb. Check{" "}
            <a href="https://caniuse.com/indexeddb" target="_blank" rel="noreferrer">
              this page
            </a>{" "}
            to see which browsers support it.
          </li>
        </ul>
      </p>
      <p>
        If you are sure that this is a Noitool issue, you can help solve it! Please click the button below to upload
        your Noitool database to help with debugging, and file a bug report{" "}
        <a target="_blank" rel="noreferrer" href="https://github.com/TwoAbove/noita-tools/issues/">
          here
        </a>
        . Please include the code [<code>{uuid}</code>] as well. <br />
        <Button
          variant={uploaded ? "success" : "primary"}
          className={classNames([uploaded && "success", "mt-3"])}
          onClick={handleUpload}
        >
          {uploaded ? "Uploaded" : "Upload"}
        </Button>
      </p>
      <p>If you are sure that this message is an error, click below.</p>
      <Button onClick={props.onProceed}>Continue</Button>
    </div>
    // <Container fluid="sm" className="mb-5 p-0 rounded shadow-lg">
    // </Container>
  );
};

export default DBError;
