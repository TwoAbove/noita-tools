import React, { FC } from "react";
import humanize from "humanize-duration";

import GameInfoProvider from "../../../services/SeedInfo/infoHandler";
import {
  IWeather,
  RAIN_TYPE_NONE,
  RAIN_TYPE_SNOW,
  RAIN_TYPE_LIQUID,
} from "../../../services/SeedInfo/infoHandler/InfoProviders/Weather";
import { MaterialInfoProvider } from "../../../services/SeedInfo/infoHandler/InfoProviders/Material";
import { Card, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import { hexTorgba } from "../../../services/imageActions/commonImageActions";

interface IWeatherProps {
  weather: IWeather;
  infoProvider: GameInfoProvider;
}

const materials = new MaterialInfoProvider(i18n);

const PrecipitationClouds: FC<{ weather: IWeather }> = ({ weather }) => {
  return (
    <div>
      <i className="bi bi-clouds me-1"></i>
      <span style={{ fontSize: "1rem" }} className="me-2">
        {Math.round(weather.clouds * 100)}%
      </span>
    </div>
  );
};
const PrecipitationFog: FC<{ weather: IWeather }> = ({ weather }) => {
  return (
    <div>
      <i className="bi bi-cloud-fog me-1"></i>
      <span style={{ fontSize: "1rem" }} className="me-2">
        {Math.round(weather.fog * 100)}%
      </span>
    </div>
  );
};
const PrecipitationDuration: FC<{ weather: IWeather }> = ({ weather }) => {
  const duration = humanize(weather.rain_duration * 1000, {
    round: true,
    units: ["h", "m"],
  });
  return (
    <div>
      <i className="bi bi-clock-history me-1"></i>
      <span style={{ fontSize: "1rem" }} className="me-2">
        {duration}
      </span>
    </div>
  );
};

const PrecipitationDescription: FC<{ weather: IWeather }> = ({ weather }) => {
  let materialName = "Clear";
  if (weather.rain_material) {
    materialName = materials.translate(weather.rain_material);
  }
  return (
    <span style={{ fontSize: "2rem" }} className="me-3 text-capitalize">
      {materialName}
    </span>
  );
};

const PrecipitationIcon: FC<{ weather: IWeather }> = ({ weather }) => {
  let icon = "";
  if (weather.rain_type === RAIN_TYPE_NONE) {
    icon = "bi-sun";
  }
  if (weather.rain_type === RAIN_TYPE_SNOW) {
    icon = "bi-cloud-snow";
    if (weather.rain_material === "slush") {
      icon = "bi-cloud-sleet";
    }
  }
  if (weather.rain_type === RAIN_TYPE_LIQUID) {
    switch (weather.rain_material) {
      case "water":
        icon = "bi-cloud-drizzle";
        if (weather.rain_particles > 7) {
          icon = "bi-cloud-rain";
        }
        if (weather.rain_particles > 15) {
          icon = "bi-cloud-rain-heavy";
        }
        break;
      case "blood":
        icon = "bi-cloud-drizzle";
        break;
      case "acid":
        icon = "bi-cloud-hail";
        break;
      case "slime":
        icon = "bi-cloud-hail";
        break;
      default:
        icon = "bi-cloud-hail";
    }
  }
  return <i style={{ fontSize: "3rem" }} className={`bi ${icon}`}></i>;
};

const Weather: FC<IWeatherProps> = ({ weather }) => {
  let color = "#ffef88";

  if (weather.rain_material) {
    const material = materials.provide(weather.rain_material);
    const [a, r, g, b] = hexTorgba(material?.graphics?.color || material.wang_color);
    color = `rgba(${r},${g},${b},${a})`;
  }
  return (
    <Card
      style={{
        width: "18rem",
        borderRadius: "1rem",
        borderWidth: "0.2rem",
        borderColor: color,
      }}
    >
      <Card.Body className="d-flex justify-content-evenly p-0">
        {weather.rain_type !== RAIN_TYPE_NONE && (
          <div className="fw-light my-2">
            {/* Extra details */}
            <PrecipitationClouds weather={weather} />
            <PrecipitationFog weather={weather} />
            <PrecipitationDuration weather={weather} />
          </div>
        )}
        <div className="d-flex align-items-center fw-medium">
          {/* Hero */}
          <PrecipitationDescription weather={weather} />
          <PrecipitationIcon weather={weather} />
        </div>
      </Card.Body>
      {weather.rain_type === RAIN_TYPE_SNOW && (
        // For some reason the footer is not rounded without this
        <Card.Footer
          style={{
            borderRadius: "0 0 1rem 1rem",
          }}
          className="text-muted fw-light p-0 text-center"
        >
          Accurate at time of generation
        </Card.Footer>
      )}
    </Card>
  );
};

export default Weather;
