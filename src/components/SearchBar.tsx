import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useSelector, useDispatch } from "react-redux";
import { TAppState, TFilterState, TSearchBarProps } from "../utils/types";
import { collections, refinedTags } from "../utils/searchLists";

import { setFilter } from "../redux/slices/filter";

const SearchBar = ({ origin, search, removeTag }: TSearchBarProps) => {
  const dispatch = useDispatch();
  const display = origin === "home" ? { span: 8, offset: 2 } : { span: 8 };
  const { type, query, collection, hideRange, endDate, startDate } =
    useSelector((state: TAppState) => state.filter);

  const mutateParams = (newParams: { [index: string]: string | boolean }) => {
    dispatch(setFilter(newParams));
  };

  const changeCollection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      currentTarget: { value },
    } = e;
    dispatch(setFilter({ collection: value }));
  };

  return (
    <Form onSubmit={search}>
      <Row>
        <Col lg={display}>
          <InputGroup className="mb-3" hasValidation={false}>
            <Button variant="primary" type="submit">
              Search
            </Button>
            <Form.Control
              placeholder={`via ${type}`}
              name="query"
              id="query-input"
              list="tags"
              defaultValue={type === "tags" ? "" : query}
            />
            {type === "tags" && (
              <>
                <datalist id="tags">
                  {refinedTags[collection as keyof typeof refinedTags].map(
                    (tag) => (
                      <option key={tag} value={tag} />
                    )
                  )}
                </datalist>
              </>
            )}
            <Form.Select
              name="collection"
              value={collection}
              onChange={changeCollection}
            >
              {collections.map((collection) => (
                <option value={collection} key={collection}>
                  {collection}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
          {type === "tags" && query.length > 0 && (
            <div className="mb-3">
              {query.split(",").map((tag) => (
                <Button
                  size="sm"
                  style={{ margin: "3px 3px 3px 0px" }}
                  onClick={() => {
                    removeTag(tag);
                  }}
                >
                  {tag + " | X"}
                </Button>
              ))}
            </div>
          )}
        </Col>
      </Row>
      <Row style={{ marginBottom: "10px" }}>
        <Col lg={display}>
          <h3>Search by</h3>
          <div key={`inline radio`} className="mb-3">
            <Form.Check
              label="tags"
              name="searchRadio"
              type={"radio"}
              id={`inline-${"radio"}-1`}
              checked={type === "tags"}
              onChange={() => {
                mutateParams({ type: "tags" });
              }}
            />
            <Form.Check
              label="caption"
              name="searchRadio"
              type={"radio"}
              id={`inline-${"radio"}-2`}
              checked={type === "caption"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                mutateParams({ type: "caption" });
              }}
            />
          </div>

          <Form.Check
            checked={!hideRange}
            type={"switch"}
            id={`date-filter`}
            label={"date filter"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              mutateParams({ hideRange: !e.currentTarget.checked });
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={display} style={{ display: hideRange ? "none" : "block" }}>
          <Form.Label>Less than {endDate}</Form.Label>
          <Form.Range
            name="endDate"
            min="1890"
            max="1938"
            value={endDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const endRange = e.currentTarget.value;
              if (Number(endRange) > Number(startDate)) {
                mutateParams({ endDate: endRange });
              }
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={display} style={{ display: hideRange ? "none" : "block" }}>
          <Form.Label>Greater than {startDate}</Form.Label>
          <Form.Range
            name="startDate"
            min="1890"
            max="1938"
            value={startDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const startRange = e.currentTarget.value;
              if (Number(startRange) < Number(endDate)) {
                mutateParams({ startDate: startRange });
              }
            }}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
