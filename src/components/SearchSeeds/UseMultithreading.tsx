import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import useLocalStorage from "../../services/useLocalStorage";

const UseMultithreadingButton = () => {
  const [useCores, setUseCores] = useLocalStorage("useCores", 1);
  const [concurrency] = useLocalStorage("search-max-concurrency", navigator.hardwareConcurrency);

  const handleMultithreading = () => {
    if (useCores > 1) {
      setUseCores(1);
    } else {
      setUseCores(concurrency);
    }
  };

  return (
    <Button size="sm" onClick={handleMultithreading} variant={useCores > 1 ? "outline-success" : "outline-secondary"}>
      Multithreading {useCores > 1 ? `on (x${useCores})` : "off"}
    </Button>
  );
};

export default UseMultithreadingButton;
