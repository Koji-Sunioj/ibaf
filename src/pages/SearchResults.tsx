import { useSearchParams, Link, useNavigate } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import SearchBar from "../components/SearchBar";

import { MockFile, TAppState, TFilterState } from "../utils/types";
import { useSelector, useDispatch } from "react-redux";

import { setFilter } from "../redux/slices/filter";

import { useEffect } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { getParams, getRefinedTags } from "../utils/functions";

const SearchResults = () => {
  const dispatch = useDispatch<any>();
  const { data, loading, error } = useSelector(
    (state: TAppState) => state.photos
  );
  const filter = useSelector((state: TAppState) => state.filter);
  const { collection, caption, tags, startDate, endDate } = filter;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const shouldFetch = data === null && !error && !loading;

    if (shouldFetch) {
      const queryParams: Omit<TFilterState, "directRefer" | "count"> = {
        caption: searchParams.get("query") || caption,
        tags: searchParams.get("tags") || tags,
        collection: searchParams.get("collection") || collection,
        startDate: searchParams.get("startDate") || startDate,
        endDate: searchParams.get("endDate") || endDate,
        hideRange:
          !searchParams.has("endDate") && !searchParams.has("startDate"),
      };
      dispatch(setFilter(queryParams));
    }
  });

  const search = (newParam: any) => {
    const filterCopy = { ...filter, ...newParam };
    const newParams = getParams(filterCopy);
    setSearchParams(newParams);
    dispatch(setFilter(filterCopy));
  };

  const addTag = (buttonTag: string) => {
    let newTags = "";
    let existingTags = tags;
    if (
      existingTags.length > 0 &&
      !existingTags.split(",").includes(buttonTag)
    ) {
      newTags = existingTags + `,${buttonTag}`;
    } else {
      newTags = buttonTag;
    }

    search({ tags: newTags });
    window.scrollTo(0, 0);
  };

  /*  const getRefinedTags = (data: MockFile[]) => {
    const byCollection =
      collection === "All collections"
        ? data
        : data.filter((item) => item.collection === collection);

    const combined = byCollection
      .map((item) => item.tags)
      .reduce(function (pre, cur) {
        return pre.concat(cur);
      });

    return Array.from(new Set(combined)).sort();
  };
 */
  const photoLength = data === null ? 0 : data.length;
  const something = data !== null ? getRefinedTags(data, collection, tags) : [];

  return (
    <>
      <div className="mt-3">
        <SearchBar
          fuckoff={something}
          count={photoLength}
          origin={"results"}
          search={search}
        />
      </div>
      <Row>
        <Col>
          <hr />
          <h2> {loading ? "loading results..." : "Results"}</h2>
        </Col>
      </Row>
      <Row className="mb-3">
        {data !== null &&
          data.map((photo: MockFile) => (
            <Col lg={6} key={photo.photoId + String(Math.random())}>
              <Card
                className="mb-3"
                key={photo.photoId + String(Math.random())}
              >
                <Card.Img
                  style={{
                    cursor: "pointer",
                  }}
                  variant="bottom"
                  src={photo.file}
                  alt={photo.file}
                  onClick={() => {
                    const params = {
                      pathname: `/photo/${photo.photoId}`,
                    };
                    navigate(params);
                  }}
                />
                <Card.Body>
                  <Card.Title>
                    <Link to={`/photo/${photo.photoId}`}>{photo.photoId}</Link>
                  </Card.Title>
                  <Card.Text className="mb-1">{photo.caption}</Card.Text>
                  <Card.Text className="mb-1">
                    {photo.tags.map((tag: string) => (
                      <Button
                        key={photo.photoId + tag + String(Math.random())}
                        style={{ margin: "3px 3px 3px 0px" }}
                        onClick={() => {
                          addTag(tag);
                        }}
                      >
                        {tag}
                      </Button>
                    ))}
                  </Card.Text>
                  {photo.date !== null && (
                    <Card.Text className="text-muted mb-1">
                      date: {photo.date.substring(0, 4)}
                    </Card.Text>
                  )}

                  <Card.Text className="text-muted  mb-1">
                    collection: {photo.collection}
                  </Card.Text>
                </Card.Body>
              </Card>{" "}
            </Col>
          ))}
      </Row>
    </>
  );
};

export default SearchResults;
