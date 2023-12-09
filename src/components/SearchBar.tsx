import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { useSelector, useDispatch } from "react-redux";
import { TAppState, TSearchBarProps } from "../utils/types";
import { collections } from "../utils/searchLists";

import { setFilter } from "../redux/slices/filter";

const SearchBar = ({
  origin,
  search,
  removeTag,
  selectedTags,
}: TSearchBarProps) => {
  const dispatch = useDispatch();
  const display = origin === "home" ? { span: 8, offset: 2 } : { span: 8 };
  const { caption, tags, collection, hideRange, endDate, startDate } =
    useSelector((state: TAppState) => state.filter);

  const mutateParams = (newParams: { [index: string]: string | boolean }) => {
    dispatch(setFilter(newParams));
  };

  const changeCollection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const {
      currentTarget: { value },
    } = e;
    dispatch(setFilter({ collection: value }));
  };

  const something = (e: any) => {
    console.log(e);
  };

  const addOption = (e: any) => {
    const {
      key,
      target: { value },
      type,
    } = e;

    if (type === "keyup" && key === "Enter") {
      if (selectedTags.includes(value)) {
        const something = tags.length > 0 ? tags.split(",") : [];
        something.push(value);
        dispatch(setFilter({ tags: something.join(",") }));
        (document.getElementById("tags-input") as HTMLInputElement).value = "";
      }
    } else if (type === "click") {
      const theValue = (
        document.getElementById("tags-input") as HTMLInputElement
      ).value;

      if (selectedTags.includes(theValue)) {
        const something = tags.length > 0 ? tags.split(",") : [];
        something.push(theValue);
        dispatch(setFilter({ tags: something.join(",") }));
        (document.getElementById("tags-input") as HTMLInputElement).value = "";
      }
    }

    /*  const {
      target: { value },
    } = e;
    console.log(value); */
    /*  if (value.length > 0) {
      const something = query.length > 0 ? query.split(",") : [];
      something.push(value);
      dispatch(setFilter({ query: something.join(",") }));
      (document.getElementById("query-input") as HTMLInputElement).value = "";
    } */
  };

  return (
    /*  <Form onSubmit={search}> */
    <>
      <Row>
        <Col lg={{ span: 3, offset: 1 }}>
          <InputGroup className="mb-3" hasValidation={false}>
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
        </Col>
        <Col lg={3}>
          <InputGroup className="mb-3" hasValidation={false}>
            <Form.Control
              placeholder={"tags"}
              name="tags"
              id="tags-input"
              list="tags"
              onKeyUp={addOption}
            />

            <>
              <datalist id="tags">
                {selectedTags.map((tag) => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
            </>

            <Button
              onClick={addOption}
              variant="light"
              type="submit"
              style={{ border: "1px solid #ced4da" }}
            >
              &#x1F50E;
            </Button>
          </InputGroup>
        </Col>
        <Col lg={3}>
          <InputGroup className="mb-3" hasValidation={false}>
            <Form.Control
              placeholder="caption"
              name="query"
              id="query-input"
              type="text"
              onChange={(e: any) => {
                dispatch(setFilter({ caption: e.target.value }));
              }}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col lg={{ span: 11, offset: 1 }}>
          <Button onClick={search}>Submit search parameters</Button>
        </Col>
      </Row>
      <Row>
        <Col lg={{ span: 10, offset: 1 }}>
          {tags.length > 0 && (
            <div className="mb-3">
              <p>Tags: </p>
              {tags.split(",").map((tag) => (
                <Button
                  key={tag}
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
        <Col lg={{ span: 3, offset: 1 }}>
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
        <Col
          lg={{ span: 10, offset: 1 }}
          style={{ display: hideRange ? "none" : "block" }}
        >
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
        <Col
          lg={{ span: 10, offset: 1 }}
          style={{ display: hideRange ? "none" : "block" }}
        >
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
    </>
    /* </Form> */
  );
};

export default SearchBar;

{
  /*   <Form.Control
              placeholder={`via ${type}`}
              name="query"
              id="query-input"
              list="tags"
              defaultValue={type === "tags" ? "" : query}
              onChange={addOption}
            />
            {type === "tags" && (
              <>
                <datalist id="tags">
                  {selectedTags.map((tag) => (
                    <option key={tag} value={tag} />
                  ))}
                </datalist>
              </>
            )} */
}
{
  /*   <Button variant="primary" type="submit">
              Search
            </Button> */
}
