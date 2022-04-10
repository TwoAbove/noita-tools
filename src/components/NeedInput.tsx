import { Alert, Container } from 'react-bootstrap';

import useLocalStorage from '../services/useLocalStorage';
// import { db } from "../services/db";

import './App.css';


const NeedInputAlert = () => {
  const [lastShow, setLastShow] = useLocalStorage('show-need-feedback-alert', 0);
  const now = +new Date();
  const show = now / 1000 - lastShow / 1000 > 604800; // 7 days;

  const handleClose = () => {
    setLastShow(+new Date());
  };

  return (
    <Container>
      <Alert show={show} variant="info" dismissible onClose={handleClose}>
        <div className="mt-2">
          Thank you for using this tool! <br />
          I want to improve it further, and need your feedback. <br />
          Click{' '}
          <a
            href="https://github.com/TwoAbove/noita-tools/issues"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>{' '}
          if you have any ideas!
        </div>
      </Alert>
    </Container>
  );
};

export default NeedInputAlert;
