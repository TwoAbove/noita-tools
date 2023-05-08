import React, { useState, useEffect, FC } from "react";
import { Row, Col, Container, Button, Form } from "react-bootstrap";
import ReactSlider from "react-slider";

import { MaterialInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Material";
import { IRule } from "../../../services/SeedInfo/infoHandler/IRule";

import Clickable from "../../Icons/Clickable";

import i18n from "../../../i18n";
import DoubleSlider from "../../misc/MultiRangeSlider";
import { IWeatherRule } from "../../../services/SeedInfo/infoHandler/InfoProviders/Weather";

interface IWeatherProps {
  onUpdateConfig: (config: Partial<IRule>) => void;
  config: IRule<IWeatherRule>;
}

const constrain = (min: number, max: number) => (value: number) => Math.max(min, Math.min(max, value));
const fogConstraint = constrain(30, 85);
const cloudConstraint = constrain(30, 100);

const material = new MaterialInfoProvider(i18n);

const rainOptions = ["", "water", "blood", "acid", "slime"];

const Weather: FC<IWeatherProps> = ({ onUpdateConfig, config }) => {
  const rainMaterial = config.val?.rain_material || "";

  const [[minFog, maxFog], setMinMaxFog] = useState(() => {
    const fog = config.val?.fog || [0, 0];
    return [fogConstraint(fog[0] * 100), fogConstraint(fog[1] * 100)];
  });
  const [[minClouds, maxClouds], setMinMaxClouds] = useState(() => {
    const clouds = config.val?.clouds || [0, 0];
    return [cloudConstraint(clouds[0] * 100), cloudConstraint(clouds[1] * 100)];
  });

  const setConfig = newConfig => {
    onUpdateConfig({
      type: "weather",
      path: "",
      params: [],
      val: newConfig,
    });
  };

  const handleClicked = type => {
    if (type === rainMaterial || type === "") {
      type = "";
      // Also delete ranges
      setConfig({ rain_material: type });
      return;
    }
    setConfig({ ...config.val, rain_material: type });
  };

  const handleSlider = (key: string, values: [number, number]) => {
    let [min, max] = values;

    // Fog and clouds constrain each other
    // Fog is between 30 and 85
    // Clouds is between 30 and 100
    // Clouds can't be lower than fog
    const newConstraints =
      key === "fog"
        ? {
            minFog: fogConstraint(min),
            minClouds: cloudConstraint(Math.max(min, minClouds)),

            maxFog: fogConstraint(max),
            maxClouds: cloudConstraint(Math.max(max, maxClouds)),
          }
        : {
            minFog: fogConstraint(Math.min(minFog, min)),
            minClouds: cloudConstraint(Math.max(min, minFog)),

            maxFog: fogConstraint(Math.min(maxFog, max)),
            maxClouds: cloudConstraint(Math.max(max, maxFog)),
          };

    setMinMaxFog([newConstraints.minFog, newConstraints.maxFog]);
    setMinMaxClouds([newConstraints.minClouds, newConstraints.maxClouds]);

    setConfig({
      ...config.val,
      fog: [newConstraints.minFog / 100, newConstraints.maxFog / 100],
      clouds: [newConstraints.minClouds / 100, newConstraints.maxClouds / 100],
    });
  };

  return (
    <Container fluid>
      <Row className="justify-content-evenly align-items-center">
        <Col>Rain type:</Col>
        {rainOptions.map((type, i) => {
          const materialName = type ? material.translate(type) : "none";
          return (
            <Col key={i}>
              <Button
                variant="outline-primary"
                className="m-3"
                onClick={() => handleClicked(type)}
                active={type === rainMaterial}
              >
                <div className="text-capitalize">{materialName}</div>
              </Button>
            </Col>
          );
        })}
      </Row>
      <Row xs={1} md={2}>
        <Col>
          Weather conditions:
          <Form.Group className="my-2">
            <Form.Label>
              Fog: ({minFog},{maxFog})
            </Form.Label>
            <div className="d-flex justify-content-start w-100">
              <div style={{ width: "80%" }}>
                <DoubleSlider
                  disabled={rainMaterial === ""}
                  min={30}
                  max={85}
                  value={[minFog, maxFog]}
                  minDistance={5}
                  onChange={val => handleSlider("fog", val)}
                />
              </div>
              <div style={{ width: "21%" }} />
            </div>
          </Form.Group>
          <Form.Group className="my-2">
            <Form.Label>
              Clouds: ({minClouds},{maxClouds})
            </Form.Label>
            <DoubleSlider
              disabled={rainMaterial === ""}
              min={30}
              max={100}
              value={[minClouds, maxClouds]}
              minDistance={5}
              onChange={val => handleSlider("clouds", val)}
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default Weather;
