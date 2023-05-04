// import Fuse from 'fuse.js';
import { Modal } from "react-bootstrap";

// const wandOptions = {
// 	shouldSort: false,
// 	keys: ['id', 'name', 'description']
// };

// const wandFuse = new Fuse(wands, wandOptions as any);

interface IWandSelectProps {
  level?: number;
  selected: any[];
  show: boolean;
  handleClose: () => void;
  handleOnClick: (id: string) => void;
  handleSelectedClicked: (id: string) => void;
}
const WandSelect = (props: IWandSelectProps) => {
  const { show, handleClose } = props;
  return (
    <Modal fullscreen="sm-down" scrollable show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Shop Item Select</Modal.Title>
      </Modal.Header>
      <Modal.Body>Wand search in development</Modal.Body>
    </Modal>
  );
};

export default WandSelect;
