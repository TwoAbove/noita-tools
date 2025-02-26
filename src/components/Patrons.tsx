import React, { FC, useState, useEffect, ReactElement } from "react";
import { Row, Col } from "react-bootstrap";
import Marquee from "react-fast-marquee";

export interface Patron {
  tier: Tier;
  members: string[];
}

export interface Tier {
  attributes: Attributes;
  id: string;
  type: string;
}

export interface Attributes {
  amount_cents: number;
  created_at: Date;
  description: string;
  discord_role_ids: null;
  edited_at: Date;
  patron_count: number;
  published: boolean;
  published_at: Date;
  requires_shipping: boolean;
  title: string;
  url: string;
}

interface IPatrons {
  [tierId: string]: Patron;
}

const PatronScroll: FC<{
  patrons: string[];
  tier: string;
  tierUrl: string;
}> = ({ patrons, tier, tierUrl }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const patronsRow = (
    <div ref={ref} className="d-flex">
      {patrons.map((patron, i) => (
        <div className="mx-1" key={`${patron}-${i}`}>
          {patron}
        </div>
      ))}
      <span style={{ width: "4rem" }}> </span>
    </div>
  );

  const title = (
    <div className="mx-1">
      <a target="_blank" rel="noreferrer" href={`https://www.patreon.com/join/10343002`}>
        {tier}
      </a>{" "}
      tier
    </div>
  );

  return (
    <div className="p-0 overflow-hidden">
      {title}
      <Marquee gradient={false} speed={patrons.reduce((l, p) => l + p.length, 0) * 0.2}>
        {patronsRow}
      </Marquee>
    </div>
  );
};

const Patrons = () => {
  const [patrons, setPatrons] = useState<IPatrons>({});

  useEffect(() => {
    fetch("/api/patreon/patrons")
      .then(res => res.json())
      .then(data => {
        setPatrons(data);
      })
      .catch(e => {
        console.error(e);
      });
  }, []);

  const elements: ReactElement[] = Object.entries(patrons)
    .sort(([, a], [, b]) => (b.tier?.attributes?.amount_cents ?? 0) - (a.tier?.attributes?.amount_cents ?? 0))
    .map(([tierId, tier]) => (
      <Col key={tierId} className="p-2">
        <PatronScroll patrons={tier.members} tier={tier.tier.attributes.title} tierUrl={tier.tier.attributes.url} />
      </Col>
    ));

  return (
    <Row xs={1} md={3} className="justify-content-start m-0 my-2">
      <div className="text-center w-100 fs-5 fw-light">A huge thank you to Noitool's supporters:</div>
      {elements}
    </Row>
  );
};

export default Patrons;
