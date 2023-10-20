import { Alert, Container } from "react-bootstrap";

import useLocalStorage from "../../services/useLocalStorage";
import PatreonButton from "../misc/PatreonButton";
// import { db } from "../services/db";

const NeedInputAlert = () => {
  const [lastShow, setLastShow] = useLocalStorage("show-need-feedback-alert", +new Date());
  const now = +new Date();
  const show = now / 1000 - lastShow / 1000 > 604800; // 7 days;

  const handleClose = () => {
    setLastShow(+new Date());
  };

  return (
    <Container>
      <Alert show={show} variant="info" dismissible onClose={handleClose}>
        <div className="mt-2">
          Thank you for using Noitool! <br />
          I want to continue improving it further, and need your feedback for that. <br />
          Click{" "}
          <a href="https://github.com/TwoAbove/noita-tools/issues" target="_blank" rel="noreferrer">
            here
          </a>{" "}
          to create a ticket or send me an <a href="mailto:me@noitool.com">email</a> if you prefer that!
        </div>
        <div className="mt-2">
          Support me on Patreon: <span className="me-2"></span>
          <PatreonButton border />
        </div>
      </Alert>
    </Container>
  );
};

export default NeedInputAlert;
