import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import SearchBar from "../components/SearchBar";

import { useNavigate } from "react-router-dom";
import {
  MockFile,
  QueryParams,
  SearchParams,
  TAppState,
  TFilterState,
} from "../utils/types";
import { useSelector, useDispatch } from "react-redux";

import { setFilter } from "../redux/slices/filter";

import { fetchPhotos } from "../redux/slices/photos";

const SearchResults = () => {
  const [searchString, setSearchString] = useState("");
  const dispatch = useDispatch<any>();
  const { data, loading, error, message } = useSelector(
    (state: TAppState) => state.photos
  );
  const { collection, type, query, startDate, endDate, directRefer } =
    useSelector((state: TAppState) => state.filter);
  const filter = useSelector((state: TAppState) => state.filter);

  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams: Omit<TFilterState, "hideRange" | "directRefer"> = {
    query: searchParams.get("query") || query,
    type: searchParams.get("type") || type,
    collection: searchParams.get("collection") || collection,
    startDate: searchParams.get("startDate") || startDate,
    endDate: searchParams.get("endDate") || endDate,
  };

  const constructParams = () => {
    const queryCopy = {};
    Object.assign(queryCopy, {
      collection: queryParams.collection,
      type: queryParams.type,
    });
    const hasDates =
      searchParams.get("startDate") !== null &&
      searchParams.get("endDate") !== null;
    if (hasDates) {
      Object.assign(queryCopy, {
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
      });
    }
    if (queryParams.query.length > 0) {
      Object.assign(queryCopy, {
        query: queryParams.query,
      });
    }
    return queryCopy;
  };

  useEffect(() => {
    const queryCopy = constructParams();
    setSearchString(JSON.stringify(queryCopy));
    if (directRefer) {
      setSearchParams(queryCopy);
      const hasDates = queryCopy.hasOwnProperty("startDate");
      hasDates && Object.assign(queryCopy, { hideRange: false });
      dispatch(setFilter({ ...queryCopy, directRefer: false }));
    } else {
      const shouldFetch = data === null && !loading && query.length > 0;
      shouldFetch && dispatch(fetchPhotos(filter));
    }
  }, [filter]);

  const search = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const {
    //   currentTarget: {
    //     query: { value: query },
    //     collection: { value: collection },
    //     startDate: { value: startDate },
    //     endDate: { value: endDate },
    //   },
    // } = event;

    // let searchString = "";
    // let dateString = "";
    // if (
    //   collections.includes(collection) &&
    //   !collection.includes("All collections")
    // ) {
    //   searchString = `&collection=${collection}`;
    // }

    // if (!hideRange) {
    //   dateString = `&startDate=${startDate}&endDate=${endDate}`;
    // }

    // if (query.length > 0) {
    //   const params = {
    //     pathname: "/results",
    //     search: `query=${query}&type=${searchType}${searchString}${dateString}`,
    //   };
    //   navigate(params);
    //   setPhotos(null);
    // }
  };

  //const fetched = photos !== null && photos.length === 0;
  console.log(data);
  console.log("rendered");

  return (
    <>
      <h6 className="mt-3 mb-3"> {searchString}</h6>
      <div>
        <SearchBar origin={"results"} search={search} />
      </div>

      {data !== null &&
        data.map((photo: MockFile) => (
          <Card className="mb-3">
            <Card.Img variant="bottom" src={photo.file} alt={photo.file} />
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
                      const queryCopy = { ...queryParams };
                      Object.keys(queryCopy).forEach((key) => {
                        const value = queryCopy[key as keyof QueryParams];
                        if (value === null) {
                          delete queryCopy[key as keyof QueryParams];
                        }
                      });

                      queryCopy.query = tag;
                      queryCopy.type = "tags";
                      const withOutNulls = queryCopy as SearchParams;
                      (
                        document.getElementById(
                          "query-input"
                        )! as HTMLInputElement
                      ).value = tag;
                      // setSearchString(tag);
                      // setSearchType("tags");
                      //setPhotos(null);
                      //setSearchParams(withOutNulls);
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
          </Card>
        ))}
    </>
  );
};

export default SearchResults;
