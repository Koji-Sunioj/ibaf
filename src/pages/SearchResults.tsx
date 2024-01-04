import { useSearchParams, Link, useNavigate } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import SearchBar from "../components/SearchBar";

import { MockFile, TAppState, TFilterState } from "../utils/types";
import { useSelector, useDispatch } from "react-redux";

import { setFilter } from "../redux/slices/filter";

import { fetchPhotos } from "../redux/slices/photos";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const SearchResults = () => {
  const dispatch = useDispatch<any>();
  const { data, loading, count, error } = useSelector(
    (state: TAppState) => state.photos
  );
  const filter = useSelector((state: TAppState) => state.filter);
  const { collection, caption, tags, startDate, endDate } = filter;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const shouldFetch = data === null && !error && !loading;
  shouldFetch &&
    (() => {
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
      dispatch(fetchPhotos(queryParams));
    })();

  const search = () => {
    const stringParams = ["tags", "caption", "collection"];
    type Cunt = {
      [key: string]: string;
    };

    const newParams: Cunt = {};

    Object.keys(filter).forEach((key) => {
      const value = filter[key as keyof typeof filter];
      if (
        stringParams.includes(key) &&
        typeof value === "string" &&
        value.length > 0
      ) {
        newParams[key] = value;
      }
    });

    if (!filter.hideRange) {
      Object.assign(newParams, {
        startDate: filter.startDate,
        endDate: filter.endDate,
      });
    }

    setSearchParams(newParams);
    dispatch(fetchPhotos(filter));
  };

  const addTag = (buttonTag: string) => {
    const stringParams = ["tags", "caption", "collection"];
    type Cunt = {
      [key: string]: string;
    };

    const newParams: Cunt = {};

    Object.keys(filter).forEach((key) => {
      const value = filter[key as keyof typeof filter];
      if (
        stringParams.includes(key) &&
        typeof value === "string" &&
        value.length > 0
      ) {
        newParams[key] = value;
      }
    });

    if (!filter.hideRange) {
      Object.assign(newParams, {
        startDate: filter.startDate,
        endDate: filter.endDate,
      });
    }

    console.log(filter);

    if (newParams.hasOwnProperty("tags")) {
      console.log(buttonTag.trim());
      newParams["tags"] += `,${buttonTag.trim()}`;
    } else {
      newParams["tags"] = `${buttonTag.trim()}`;
    }

    console.log(newParams);

    dispatch(setFilter(newParams));

    search();
  };

  const photoLength = count !== null ? count : 0;
  return (
    <>
      <div className="mt-3 mb-3">
        <SearchBar
          /* selectedTags={selectedTags} */
          count={photoLength}
          origin={"results"}
          search={search}
          /*  removeTag={removeTag} */
        />
      </div>
      <Row className="mb-3">
        <Col /* lg={{ span: 10, offset: 1 }} */>
          <hr />
          <h2> {loading ? "loading results..." : "Results"}</h2>
        </Col>
      </Row>
      <Row className="mb-3">
        {data !== null &&
          data /* .slice(0, 10) */
            .map((photo: MockFile) => (
              <Col /* lg={{ span: 5, offset: 1 }} */ lg={6}>
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
                      <Link to={`/photo/${photo.photoId}`}>
                        {photo.photoId}
                      </Link>
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
