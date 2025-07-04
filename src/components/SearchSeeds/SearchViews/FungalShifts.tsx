/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, FC } from "react";
import { Row, Col, Container, Stack, Button } from "react-bootstrap";

import { FungalShiftInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/FungalShift";
import { IRule } from "../../../services/SeedInfo/infoHandler/IRule";
import { Square } from "../../helpers";
import { FlaskMaterialSelect } from "../../MaterialSelect";

const fungalInfoProvider = new FungalShiftInfoProvider({} as any);

interface IFungalShiftsProps {
  onUpdateConfig: (config: Partial<IRule>) => void;
  config: IRule;
}

interface IOpen {
  open: boolean;
  row?: number;
  type?: "from" | "to";
}

const materialsFrom = fungalInfoProvider.fungalData.materials_from.map(m => m.materials);
const materialsTo = fungalInfoProvider.fungalData.materials_to.map(m => m.material);

const FungalShifts: FC<IFungalShiftsProps> = ({ onUpdateConfig, config }) => {
  const { val: fungalShifts } = config;
  const [selectOpen, setSelectOpen] = useState<IOpen>({ open: false });

  const setFungalShifts = newConfig => {
    onUpdateConfig({
      type: "fungalShift",
      path: "",
      params: [],
      val: newConfig,
    });
  };

  const getSelected = (row?: number, type?: string) => {
    if (typeof row == "undefined") {
      return new Set<string>([]);
    }
    if (typeof type == "undefined") {
      return new Set<string>([]);
    }
    if (!fungalShifts[row]) {
      return new Set<string>([]);
    }
    return new Set<string>(fungalShifts[row][type]);
  };

  const isSelected = (row: number, type: "from" | "to") => {
    if (!fungalShifts[row]) {
      return false;
    }
    const t = type === "to" ? "flaskTo" : "flaskFrom";
    return !!(fungalShifts[row][type] || fungalShifts[row][t]);
  };

  const getFlask = (row?: number, type?: string): boolean => {
    if (typeof row === "undefined") {
      return false;
    }
    if (typeof type === "undefined") {
      return false;
    }
    if (!fungalShifts[row]) {
      return false;
    }
    const t = type === "to" ? "flaskTo" : "flaskFrom";
    return fungalShifts[row][t] || false;
  };

  const getList = (type?: string): string[] => {
    if (type === "to") {
      return materialsTo;
    }
    if (type === "from") {
      return materialsFrom.map(m => m.join(","));
    }
    return [];
  };

  const handleClear = (row: number) => {
    if (typeof row === "undefined") {
      return;
    }
    delete fungalShifts[row];
    setFungalShifts([...fungalShifts]);
  };

  const handleSelect = (list: string[], row?: number, type?: string) => {
    if (typeof row === "undefined") {
      return;
    }
    if (typeof type === "undefined") {
      return;
    }
    if (!fungalShifts[row]) {
      fungalShifts[row] = {};
    }
    fungalShifts[row][type] = list;
    setFungalShifts([...fungalShifts]);
  };

  const handleHeldMaterial = (row?: number, type?: string, val?: boolean) => {
    if (typeof row === "undefined") {
      return;
    }
    if (typeof type === "undefined") {
      return;
    }
    if (!fungalShifts[row]) {
      fungalShifts[row] = {};
    }
    const t = type === "to" ? "flaskTo" : "flaskFrom";
    if (val) {
      fungalShifts[row][t] = val;
    }
    if (!val) {
      delete fungalShifts[row][t];
    }
    setFungalShifts([...fungalShifts]);
  };

  const handleOpen = (row: number, type: "from" | "to") => {
    setSelectOpen({ open: true, row, type });
  };

  const handleClose = () => {
    setSelectOpen({ open: false });
  };

  return (
    <Container fluid>
      <p>
        Lists can be left blank if any material will do. <br />
        At least one of the selected materials will be in the found seeds.
      </p>
      <Stack gap={2}>
        {fungalShifts.map((shift, i) => {
          return (
            <Stack direction="horizontal" gap={3} key={i}>
              <Col xs={1}>Shift {i + 1}</Col>
              <Col xs="auto">
                <Button
                  variant={isSelected(i, "from") ? "primary" : "outline-primary"}
                  onClick={() => handleOpen(i, "from")}
                >
                  <Square>Edit From</Square>
                </Button>
              </Col>
              <Col xs="auto">
                <Button
                  variant={isSelected(i, "to") ? "primary" : "outline-primary"}
                  onClick={() => handleOpen(i, "to")}
                >
                  <Square>Edit To</Square>
                </Button>
              </Col>
              {shift && (
                <Col>
                  <Button variant="outline-primary" onClick={() => handleClear(i)}>
                    <Square>Clear</Square>
                  </Button>
                </Col>
              )}
            </Stack>
          );
        })}
      </Stack>
      <FlaskMaterialSelect
        show={selectOpen.open}
        selected={getSelected(selectOpen.row, selectOpen.type)}
        type={selectOpen.type}
        useFlask={getFlask(selectOpen.row, selectOpen.type)}
        list={getList(selectOpen.type)}
        handleClose={() => handleClose()}
        handleHeldMaterial={val => handleHeldMaterial(selectOpen.row, selectOpen.type, val)}
        goldToGold={
          selectOpen.row !== undefined &&
          getFlask(selectOpen.row, selectOpen.type) &&
          !!fungalShifts[selectOpen.row]?.gold_to_x
        }
        holyGrassToHolyGrass={
          selectOpen.row !== undefined &&
          getFlask(selectOpen.row, selectOpen.type) &&
          !!fungalShifts[selectOpen.row]?.grass_to_x
        }
        handleGoldToGold={val => {
          console.log("handleGoldToGold", selectOpen.row, selectOpen.type, val);
          if (selectOpen.row === undefined || selectOpen.type === undefined) {
            return;
          }
          if (selectOpen.type === "to") {
            if (!fungalShifts[selectOpen.row]) {
              fungalShifts[selectOpen.row] = {};
            }
            if (val) {
              fungalShifts[selectOpen.row]["gold_to_x"] = "gold";
            } else {
              delete fungalShifts[selectOpen.row]["gold_to_x"];
            }
            setFungalShifts([...fungalShifts]);
          }
        }}
        handleHolyGrassToHolyGrass={val => {
          if (selectOpen.row === undefined || selectOpen.type === undefined) {
            return;
          }
          if (selectOpen.type === "to") {
            if (!fungalShifts[selectOpen.row]) {
              fungalShifts[selectOpen.row] = {};
            }
            if (val) {
              fungalShifts[selectOpen.row]["grass_to_x"] = "grass_holy";
            } else {
              delete fungalShifts[selectOpen.row]["grass_to_x"];
            }
            setFungalShifts([...fungalShifts]);
          }
        }}
        handleOnUpdate={list => handleSelect(list, selectOpen.row, selectOpen.type)}
      />
    </Container>
  );
};

export default FungalShifts;
