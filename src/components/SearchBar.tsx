import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";
import { refinedTags } from "../utils/searchLists";
import { setFilter, setDate } from "../redux/slices/filter";
import { useSelector, useDispatch } from "react-redux";
import { TAppState, TSearchBarProps } from "../utils/types";
import { collectionWCount } from "../utils/searchLists";

const SearchBar = ({ origin, search, count }: TSearchBarProps) => {
  const [timer, setTimer] = useState<any>(null);
  const dispatch = useDispatch();

  const { tags, collection, hideRange, endDate, startDate } = useSelector(
    (state: TAppState) => state.filter
  );

  const removeTag = (buttonTag: string) => {
    const tagsArray = tags.split(",");
    const withThatTag = tagsArray.filter((tag) => tag !== buttonTag);
    dispatch(setFilter({ tags: withThatTag.join(",") }));
  };

  const changeCollection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const {
      currentTarget: { value },
    } = e;
    dispatch(setFilter({ collection: value, tags: "" }));
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
  };

  const selectedTags = refinedTags[collection as keyof typeof refinedTags];

  const finalTags =
    tags.length > 0
      ? selectedTags.filter((tag) => !tags.split(",").includes(tag))
      : selectedTags;

  const mutateParams = (
    newParams: { [index: string]: string | boolean },
    triggerCount = false
  ) => {
    if (triggerCount) {
      dispatch(setFilter(newParams));
    } else {
      dispatch(setDate(newParams));
    }
  };

  return (
    <>
      <Row>
        <Col /* lg={{ span: 3, offset: 1 }} */ lg={3}>
          {/*     <Form.Label>Choose a collection:</Form.Label> */}
          <InputGroup className="mb-3" hasValidation={false}>
            <Form.Select
              name="collection"
              value={collection}
              onChange={changeCollection}
            >
              {Array.from(collectionWCount).map((item) => (
                <option value={item["name"]} key={item["name"]}>
                  {item["name"] + ` (${item["count"]})`}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col /* lg={3} */ lg={3}>
          {/* <Form.Label>Select tag(s):</Form.Label> */}
          <InputGroup className="mb-3" hasValidation={false}>
            <Form.Control
              placeholder={"Add tags"}
              name="tags"
              id="tags-input"
              list="tags"
              onKeyUp={addOption}
            />
            <datalist id="tags">
              {finalTags.map((tag) => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
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
        <Col /* lg={3} */ lg={3}>
          {/* <Form.Label>Caption contains:</Form.Label> */}
          <InputGroup className="mb-3" hasValidation={false}>
            <Form.Control
              placeholder="Search in captions"
              name="query"
              id="query-input"
              type="text"
              onChange={(e: any) => {
                dispatch(setFilter({ caption: e.target.value }));
              }}
            />
          </InputGroup>
        </Col>
        <Col /* lg={{ span: 3, offset: 1 }} */ lg={3}>
          {/*  <Form.Label>Date Filter</Form.Label> */}
          <InputGroup className="mb-3" hasValidation={false}>
            <Form.Check
              label={"date filter"}
              checked={!hideRange}
              type={"switch"}
              id={`date-filter`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                mutateParams({ hideRange: !e.currentTarget.checked });
              }}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col /* lg={{ span: 10, offset: 1 }} */>
          {tags.length > 0 && (
            <div className="mb-3">
              <p>
                Tags:&nbsp;&nbsp;&nbsp;
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
                ))}{" "}
              </p>
            </div>
          )}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col
          id="results-col"
          /* lg={{ span: 11, offset: 1 }} */
        >
          <Button onClick={search}>Show results</Button>
        </Col>
      </Row>

      {/*   <Row style={{ marginBottom: "10px" }}>
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
 */}
      <Row>
        <Col
          /*  lg={{ span: 10, offset: 1 }} */
          style={{ display: hideRange ? "none" : "block" }}
        >
          <Form.Label>Less than {endDate}</Form.Label>
          <Form.Range
            name="endDate"
            min="1890"
            max="1938"
            value={endDate}
            /* value={endDate} */
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const endRange = e.currentTarget.value;
              if (Number(endRange) > Number(startDate)) {
                mutateParams({ endDate: endRange });
                clearTimeout(timer);
                const newTimer = setTimeout(() => {
                  mutateParams({ endDate: endRange }, true);
                }, 500);
                setTimer(newTimer);
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col
          /* lg={{ span: 10, offset: 1 }} */
          style={{ display: hideRange ? "none" : "block" }}
        >
          <Form.Label>Greater than {startDate}</Form.Label>
          <Form.Range
            name="startDate"
            min="1890"
            max="1938"
            value={startDate}
            /* value={startDate} */
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const startRange = e.currentTarget.value;
              if (Number(startRange) < Number(endDate)) {
                mutateParams({ startDate: startRange });
                clearTimeout(timer);
                const newTimer = setTimeout(() => {
                  mutateParams({ startDate: startRange }, true);
                }, 500);
                setTimer(newTimer);
              }
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col /*  lg={{ span: 11, offset: 1 }} */>
          {`current selection: ${count} photos`}
        </Col>
      </Row>
    </>
  );
};

export default SearchBar;
