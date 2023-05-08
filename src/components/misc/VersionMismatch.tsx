import { Button } from "react-bootstrap";

export const VersionMisatch = () => {
  return (
    <Button
      style={{
        position: "relative",
      }}
      disabled={true}
      variant={"outline-danger"}
    >
      Noitool version mismatch, please reload
      <div
        style={{
          position: "absolute",
          top: "-0.0rem",
          right: "0.5rem",
          fontSize: "1rem",
        }}
        className="ms-2"
      >
        <i className="bi bi-exclamation-triangle-fill"></i>
      </div>
    </Button>
  );
};
