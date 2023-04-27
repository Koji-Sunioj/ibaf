import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [hideRange, setHideRange] = useState(true);
  const [startDate, setStartDate] = useState("1890");
  const [endDate, setEndDate] = useState("1938");
  const navigate = useNavigate();

  const collections = [
    "All collections",
    "Couvent St. Etienne",
    "Couvent St. Etienne / Charles Prickartz",
    "Couvent St. Etienne /  Sainte-Anne",
    "Couvent St. Etienne / Jesuit",
    "Couvent St. Etienne / The Sainte-Anne Collection ",
    "Couvent St. Etienne /  Notre-Dame de France",
    "Couvent St. Etienne / Paulus-Haus",
    "Couvent St. Etienne / JOURDAIN COULEURS",
    "Couvent St. Etienne / Bethléem coloriée",
  ];

  const search = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      currentTarget: {
        query: { value: query },
        collection: { value: collection },
        startDate: { value: startDate },
        endDate: { value: endDate },
      },
    } = event;

    let searchString = "";
    let dateString = "";
    if (
      collections.includes(collection) &&
      !collection.includes("All collections")
    ) {
      searchString = `&collection=${collection}`;
    }

    if (!hideRange) {
      dateString = `&start-date=${startDate}&end-date=${endDate}`;
    }

    if (query.length > 0) {
      const params = {
        pathname: "/results",
        search: `query=${query}${searchString}${dateString}`,
      };
      navigate(params);
    }
  };

  return (
    <>
      <h1 className="mt-3" style={{ textAlign: "center" }}>
        Welcome to the EBAF Collection
      </h1>
      <p style={{ textAlign: "center" }}>
        We have more than 31,000 photos as of December 2022
      </p>
      <div>
        <Form onSubmit={search}>
          <Row>
            <Col lg={{ span: 8, offset: 2 }}>
              <InputGroup className="mb-3" hasValidation={false}>
                <Button variant="primary" type="submit">
                  Search
                </Button>
                <Form.Control placeholder="title, caption..." name="query" />
                <Form.Select name="collection">
                  {collections.map((collection) => (
                    <option value={collection} key={collection}>
                      {collection}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Col lg={{ span: 8, offset: 2 }}>
              <Form.Check
                type={"checkbox"}
                id={`date-filter`}
                label={"Date Filter"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setHideRange(!e.currentTarget.checked);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col
              lg={{ span: 8, offset: 2 }}
              style={{ display: hideRange ? "none" : "block" }}
            >
              <Form.Label>Greater than {endDate}</Form.Label>
              <Form.Range
                name="endDate"
                min="1890"
                max="1938"
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const endRage = e.currentTarget.value;
                  if (Number(endRage) > Number(startDate)) {
                    setEndDate(endRage);
                  }
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col
              lg={{ span: 8, offset: 2 }}
              style={{ display: hideRange ? "none" : "block" }}
            >
              <Form.Label>Less than {startDate}</Form.Label>
              <Form.Range
                name="startDate"
                min="1890"
                max="1938"
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const startRange = e.currentTarget.value;
                  if (Number(startRange) < Number(endDate)) {
                    setStartDate(startRange);
                  }
                }}
              />
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default HomePage;
