import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { collections, refinedTags } from "../utils/searchLists";

type TSearchBarProps = {
  origin: string;
  search: (event: React.FormEvent<HTMLFormElement>) => void;
  endDate: string;
  startDate: string;
  searchType: string;
  hideRange: boolean;
  currentTagGroup: string;
  query?: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setSearchType: React.Dispatch<React.SetStateAction<string>>;
  setHideRange: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTagGroup: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar = ({
  origin,
  search,
  endDate,
  startDate,
  searchType,
  hideRange,
  currentTagGroup,
  query = "",
  setEndDate,
  setStartDate,
  setSearchType,
  setHideRange,
  setCurrentTagGroup,
}: TSearchBarProps) => {
  const display = origin === "home" ? { span: 8, offset: 2 } : { span: 8 };

  return (
    <Form onSubmit={search}>
      <Row>
        <Col lg={display}>
          <InputGroup className="mb-3" hasValidation={false}>
            <Button variant="primary" type="submit">
              Search
            </Button>
            <Form.Control
              placeholder={`via ${searchType}`}
              name="query"
              id="query-input"
              list="tags"
              defaultValue={query}
            />
            {searchType === "tags" && (
              <>
                <datalist id="tags">
                  {refinedTags[currentTagGroup as keyof typeof refinedTags].map(
                    (tag) => (
                      <option key={tag} value={tag} />
                    )
                  )}
                </datalist>
              </>
            )}
            <Form.Select
              name="collection"
              value={currentTagGroup}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setCurrentTagGroup(e.currentTarget.value);
              }}
            >
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
        <Col lg={display}>
          <h3>Options</h3>
          <Form.Check
            checked={searchType !== "caption"}
            type={"switch"}
            id={`search-type`}
            label={`${searchType} search`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.currentTarget.checked
                ? setSearchType("tags")
                : setSearchType("caption");
            }}
          />
          <Form.Check
            checked={!hideRange}
            type={"switch"}
            id={`date-filter`}
            label={"date filter"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setHideRange(!e.currentTarget.checked);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={display} style={{ display: hideRange ? "none" : "block" }}>
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
        <Col lg={display} style={{ display: hideRange ? "none" : "block" }}>
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
  );
};

export default SearchBar;
