import React, { FC, useContext, useEffect, useRef, useState } from "react";
import {
  Container,
  Stack,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Modal,
  Table,
} from "react-bootstrap";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider, MouseTransition, TouchTransition } from "react-dnd-multi-backend";
import { mergeRefs } from "react-merge-refs";

import { IRule, ILogicRules, RuleType } from "../../services/SeedInfo/infoHandler/IRule";
import SeedDataOutput from "../SeedInfo/SeedDataOutput";
import { getTreeTools } from "./node";
import classNames from "classnames";
import SearchContextProvider, { useSearchContext } from "./SearchContext";
import RuleConstructor, { RuleConstructors } from "./RuleConstructor";
import { useLiveQuery } from "dexie-react-hooks";
import { SearchesItem, db, deleteSearch, getExportableSearch, newSearch } from "../../services/db";
import useLocalStorage from "../../services/useLocalStorage";

const treeTools = getTreeTools("id", "rules");

type IIDRule = IRule & { id: string };

interface IRuleProps extends IIDRule {
  deletable?: boolean;
  draggable?: boolean;
  titleProps?: any;
  highlight?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}
const Rule: FC<IRuleProps> = ({ id, type, deletable, draggable, titleProps, highlight }) => {
  const rc = RuleConstructors[type] || {};
  const { ruleDispatch, ruleTree } = useSearchContext();
  const [collected, drag, dragPreview] = useDrag(
    () => ({
      type: "rule",
      item: { id },
    }),
    [id, type, deletable, draggable],
  );

  const active = ruleTree.selectedRule === id;

  const handleDelete = () => {
    ruleDispatch({ action: "delete", data: id });
  };
  const handleClick = () => {
    ruleDispatch({ action: "select", data: id });
  };

  return (
    <Stack direction="horizontal" gap={2} className="align-items-center" ref={dragPreview} {...(collected as any)}>
      {draggable && <i className="bi bi-grip-vertical" ref={drag}></i>}
      <ListGroup.Item
        active={active}
        action
        onClick={handleClick}
        className={classNames(["rounded", highlight && "border-primary"])}
      >
        <div className={classNames(highlight && "text-center")}>{rc.Title(titleProps || {})}</div>
      </ListGroup.Item>
      {deletable && (
        <Button onClick={handleDelete} size="sm" variant="outline-warning">
          <i className="bi bi-x"></i>
        </Button>
      )}
    </Stack>
  );
};

interface ILogicRuleProps extends ILogicRules {
  deletable?: boolean;
  draggable?: boolean;
}
const LogicRule: FC<ILogicRuleProps> = ({ type, id, rules, deletable, draggable }) => {
  const { ruleDispatch } = useSearchContext();
  const handleDelete = () => {
    ruleDispatch({ action: "delete", data: id });
  };
  const [dragProps, dragRef, dragPreviewRef] = useDrag(
    () => ({
      type: "rule",
      item: { id },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, type, rules, deletable, draggable],
  );

  const [dropProps, dropRef] = useDrop(
    () => ({
      accept: "rule",
      drop: (item: any, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        if (type === RuleType.NOT && rules.length > 0) {
          return false;
        }
        if (item.id === id) {
          // dropped into self
          return;
        }
        ruleDispatch({
          action: "move",
          data: {
            source: item.id,
            dest: id,
          },
        });
      },
      canDrop: (item, monitor) => {
        if (item.id === id) {
          return false;
        }
        if (type === RuleType.NOT && rules.length > 0) {
          return false;
        }
        return true;
      },
      collect: monitor => ({
        canDrop: monitor.canDrop() && monitor.isOver({ shallow: true }),
      }),
    }),
    [id, type, rules, deletable, draggable],
  );
  const rule = RuleConstructors[type];
  return (
    <Card
      style={{ transition: "0.16s" }}
      className={classNames(
        "p-3 pe-2 shadow-sm",
        dropProps.canDrop && "bg-info",
        dragProps.isDragging && "bg-secondary",
      )}
      ref={mergeRefs([dropRef, dragPreviewRef])}
    >
      <Stack direction="horizontal" gap={2} className="align-items-center">
        {draggable && <i className="bi bi-grip-vertical" ref={dragRef}></i>}
        {rule.Title()}
        <div className="ms-auto"></div>
        {deletable && (
          <Button onClick={handleDelete} size="sm" variant="outline-warning">
            <i className="bi bi-x"></i>
          </Button>
        )}
      </Stack>
      <hr />
      <Stack gap={2}>
        {rules.map(r => {
          if (r.type !== RuleType.RULES && r.rules) {
            return <LogicRule deletable draggable key={r.id} {...r} />;
          }
          return <Rule deletable draggable key={r.id} {...r} />;
        })}
      </Stack>
    </Card>
  );
};

interface IAddProps {
  onAdd: (type: string) => void;
}
const Add: FC<IAddProps> = ({ onAdd }) => {
  const rules = Object.keys(RuleConstructors).filter(
    k => !["search", RuleType.AND, RuleType.OR, RuleType.NOT].includes(k),
  );

  return (
    <DropdownButton
      className="w-100"
      variant="outline-primary"
      as={ButtonGroup}
      id="dropdown-item-button"
      title="Add new rule"
    >
      {rules.map(r => {
        const rule = RuleConstructors[r];
        return (
          <Dropdown.Item key={r} onClick={() => onAdd(r)} as="button">
            {rule.Title()}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

const validJSON = (s: string) => {
  try {
    JSON.parse(atob(s));
  } catch (e) {
    return false;
  }
  return true;
};

interface IImportProps {
  onClick: (data: string) => any;
}
export const Import: FC<IImportProps> = ({ onClick }) => {
  const [ripple, setRipple] = useState(false);
  const [rippleError, setRippleError] = useState(false);
  const [currentSearchUUID, setCurrentSearchUUID] = useLocalStorage("search-current-search-uuid", "");

  const inputRef = useRef<HTMLInputElement>(null);

  const clear = () => {
    if (!inputRef || !inputRef.current) {
      return;
    }
    inputRef.current.value = "";
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    var items = (event.clipboardData || ((event as any).originalEvent.clipboardData as DataTransfer)).items;
    for (const index in items) {
      var item = items[index];
      if (item.kind === "string") {
        item.getAsString(s => {
          if (validJSON(s)) {
            setRipple(true);
            setTimeout(() => setRipple(false), 500);
            onClick(s);
          } else {
            setRippleError(true);
            setTimeout(() => setRippleError(false), 500);
          }
        });
      }
    }
    setTimeout(() => clear(), 500);
  };

  const handleClick = () => {
    if (!inputRef || !inputRef.current) {
      return;
    }
    const s = inputRef.current.value;
    onClick(s);
    clear();
  };

  const handleNew = () => {
    newSearch()
      .then(uuid => {
        setCurrentSearchUUID(uuid);
      })
      .catch(e => console.error(e));
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste as any);
    return () => {
      window.removeEventListener("paste", handlePaste as any);
    };
  });

  return (
    <InputGroup>
      <Form.Control
        className={classNames([
          rippleError && "border-danger text-danger border-1",
          ripple && "border-success text-success border-1",
        ])}
        placeholder="Import search from string"
        ref={inputRef}
      />
      <Button
        onClick={() => handleClick()}
        style={{
          transition: "0.2s",
        }}
        className={classNames([
          rippleError && "border-danger text-danger border-1",
          ripple && "border-success text-success border-1",
          "border",
        ])}
        variant="outline-info"
      >
        Import
      </Button>
      <div className="mx-3"></div>
      <Button variant="outline-info" onClick={() => handleNew()}>
        New Search
      </Button>
    </InputGroup>
  );
};

const CustomSearchDropdownToggle = React.forwardRef<any, any>(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={e => {
      e.stopPropagation();
      e.preventDefault();
      onClick(e);
    }}
    className="w-100 h-100 d-flex align-items-center justify-content-center"
  >
    <i className="bi bi-three-dots-vertical m-2"></i>
    {children}
  </div>
));

interface ISearchRowProps {
  current: boolean;
  search: SearchesItem;
}
const SearchRow: FC<ISearchRowProps> = ({ current, search }) => {
  const [currentSearchUUID, setCurrentSearchUUID] = useLocalStorage("search-current-search-uuid", "");

  const handleClick = () => {
    setCurrentSearchUUID(search.uuid);
  };

  const { config } = search;

  const [clickedDelete, setClickedDelete] = useState(false);
  const [ripple, setRipple] = useState(false);

  const handleExport = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const exportedSearch = await getExportableSearch(search.uuid);

    navigator.clipboard
      .writeText(btoa(JSON.stringify(exportedSearch)))
      .catch(e => console.error(e))
      .finally(() => {
        setRipple(true);
        setTimeout(() => setRipple(false), 1000);
      });
  };

  const handleDelete = async e => {
    e.stopPropagation();
    if (!clickedDelete) {
      setClickedDelete(true);
      setTimeout(() => setClickedDelete(false), 1500);
      return;
    }
    const newUUID = await deleteSearch(search.uuid)
      .then(newUUID => {
        if (!newUUID) {
          return newSearch();
        }
        return newUUID;
      })
      .catch(console.error);
    setCurrentSearchUUID(newUUID || "");
  };

  return (
    <tr style={{ cursor: "pointer" }} onClick={() => handleClick()} className={classNames(current && "table-active")}>
      <td>
        <i className={classNames(["bi", !current && "bi-play", current && "bi-play-fill"])}></i>
      </td>
      <td className="w-50">
        {/* Load search button and Name input field */}
        <InputGroup>
          <Form.Control
            className={classNames([
              ripple && "border-success text-success border-1",
              current && "border-primary text-primary border-1",
            ])}
            onClick={e => e.stopPropagation()}
            onChange={e => {
              e.stopPropagation();
              db.searches
                .update(search.id!, {
                  config: { ...search.config, name: e.target.value },
                  updatedAt: new Date(),
                })
                .catch(console.error);
            }}
            placeholder="Unnamed Search"
            value={config.name}
          />
        </InputGroup>
      </td>
      <td className="fw-light">{search.updatedAt.toLocaleString()}</td>
      <td className="">
        <div className="d-flex align-items-stretch justify-content-end">
          <ButtonGroup>
            {/* {!current && (
							<Button onClick={() => handleClick()} variant="outline-info">
								Load
							</Button>
						)} */}
            <Dropdown
              className={classNames([
                "btn btn-outline-secondary p-0",
                current && "border-primary text-primary border-1",
                ripple && "border-success text-success border-1",
              ])}
            >
              <Dropdown.Toggle as={CustomSearchDropdownToggle}></Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  className=""
                  as={"div"}
                  onClick={e => handleExport(e)}
                  // className="w-100"
                >
                  Export to string
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  as={"div"}
                  onClick={handleDelete}
                  className={classNames(clickedDelete ? "text-danger" : "text-warning")}
                >
                  {clickedDelete ? "Delete?" : "Delete"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
        </div>
      </td>
    </tr>
  );
};

interface ISearchSelectProps {
  open: boolean;
  onClose: () => any;
}
const SearchSelect: FC<ISearchSelectProps> = ({ open, onClose }) => {
  const { currentSearchUUID, handleImportSearch } = useSearchContext();
  const query = useLiveQuery(() => db.searches.toArray());
  const searches = query ? query : [];

  return (
    <Modal size="lg" fullscreen="sm-down" scrollable show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Load search</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          minHeight: "40vh",
        }}
      >
        <Import onClick={s => handleImportSearch(s)} />
        <div className="my-4" />
        <Table borderless hover className="align-middle me-auto">
          <thead>
            <tr>
              <td>{/* <i className="bi bi-search"></i> */}</td>
              <td className="ps-2 w-50">Name</td>
              <td className="ps-2 fw-light">Last updated</td>
              <td className=""></td>
            </tr>
          </thead>
          <tbody>
            {searches.map(s => (
              <SearchRow key={s.id} current={s.uuid === currentSearchUUID} search={s} />
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

interface ILoadProps {
  onLoad: (data: string) => any;
}

const Load: FC<ILoadProps> = props => {
  const [loadOpen, setLoadOpen] = useState(false);

  return (
    <>
      <Button className="w-100" variant="outline-info" onClick={() => setLoadOpen(true)}>
        Manage saved searches
      </Button>
      <SearchSelect open={loadOpen} onClose={() => setLoadOpen(false)} />
    </>
  );
};

const LogicConstructors = {
  [RuleType.AND]: {
    Title: () => "And",
    type: RuleType.AND,
  },
  [RuleType.OR]: {
    Title: () => "Or",
    type: RuleType.OR,
  },
  [RuleType.NOT]: {
    Title: () => "Not",
    type: RuleType.NOT,
  },
};
interface ILogicProps {
  onLogic: (type: string) => void;
}
const Logic: FC<ILogicProps> = ({ onLogic }) => {
  const rules = Object.keys(LogicConstructors);

  return (
    <DropdownButton
      className="w-100"
      variant="outline-primary"
      as={ButtonGroup}
      id="dropdown-item-button"
      title="Add logic"
    >
      {rules.map(r => {
        const rule = LogicConstructors[r];
        return (
          <Dropdown.Item key={r} onClick={() => onLogic(r)} as="button">
            {rule.Title()}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

// I think DND should be replaced with https://github.com/atlassian/react-beautiful-dnd
interface IRuleListProps {}
const RuleList: FC<IRuleListProps> = () => {
  const { ruleTree, computeJobName, ruleDispatch, uuid } = useSearchContext();

  return (
    <DndProvider
      options={{
        backends: [
          {
            id: "html5",
            backend: HTML5Backend,
            transition: MouseTransition,
          },
          {
            id: "touch",
            backend: TouchBackend,
            options: {
              enableMouseEvents: true,
            },
            preview: true,
            transition: TouchTransition,
          },
        ],
      }}
    >
      <ListGroup className="py-2">
        <Row className="mb-1 d-flex justify-content-between">
          {/* <Col className="my-2" xl={12}>
						<Import
							onClick={data => ruleDispatch({ action: 'import', data })}
						/>
					</Col>
					<Col className="my-2" xs={12}>
						<Export />
					</Col> */}
          <Col xs={12} className="my-2">
            <Load onLoad={data => ruleDispatch({ action: "import", data })} />
          </Col>
        </Row>
        <Rule
          onClick={() => ruleDispatch({ action: "select", data: "search" })}
          id="search"
          type="search"
          highlight
          titleProps={{ name: computeJobName }} // TODO: Handle multiple searches
        />
        <hr />
        <LogicRule {...ruleTree} />
        <hr />
        <Row lg={1} xl={2} className="d-flex justify-content-between">
          <Col className="my-2" xs={12}>
            <Add onAdd={type => ruleDispatch({ action: "add", data: { type } })} />
          </Col>
          <Col className="my-2" xs={12}>
            <Logic onLogic={type => ruleDispatch({ action: "add", data: { type } })} />
          </Col>
        </Row>
      </ListGroup>
    </DndProvider>
  );
};

export default RuleList;
