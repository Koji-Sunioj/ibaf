import { useEffect } from "react";
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
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { data, loading, error, message } = useSelector(
    (state: TAppState) => state.photos
  );

  const { collection, type, query } = useSelector(
    (state: TAppState) => state.filter
  );
  const filter = useSelector((state: TAppState) => state.filter);

  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams: Omit<TFilterState, "hideRange"> = {
    query: searchParams.get("query") || query,
    type: searchParams.get("type") || type,
    collection: searchParams.get("collection") || collection,
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  };

  // const isSameAsReducer = Object.keys(queryParams).some((key) => {
  //   const filterValue = filter[key as keyof TFilterState];
  //   const paramValue =
  //     queryParams[key as keyof Omit<TFilterState, "hideRange">];
  //   return filterValue !== paramValue;
  // });

  const constructParams = () => {
    const queryCopy = {};
    if (
      queryParams.endDate.length !== 0 &&
      queryParams.startDate.length !== 0
    ) {
      Object.assign(queryCopy, {
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
      });
    }
    Object.assign(queryCopy, {
      collection: queryParams.collection,
      type: queryParams.type,
    });
    if (queryParams.query.length > 0) {
      Object.assign(queryCopy, {
        query: queryParams.query,
      });
    }
    return queryCopy;
  };

  const compareParams = (newParams: any) => {
    const isNotSame = Object.keys(newParams).some((key) => {
      const queryValue = newParams[key];
      const filterVale = filter[key as keyof TFilterState];
      return queryValue !== filterVale;
    });

    return isNotSame;
  };

  useEffect(() => {
    const queryCopy = constructParams();
    setSearchParams(queryCopy);
    const isNotSame = compareParams(queryCopy);

    if (isNotSame) {
      if (queryCopy.hasOwnProperty("startDate")) {
        Object.assign(queryCopy, { hideRange: false });
      }
      dispatch(setFilter(queryCopy));
    } else {
      dispatch(fetchPhotos());
    }
  }, [filter]);

  // console.log(window.URL.toString());

  // queryParams.query !== null &&
  //   data === null &&
  //   !loading &&
  //   (async () => {
  //     setLoading(true);
  //     const { query, collection, startDate, endDate, type } = queryParams;
  //     const request = await fetch("188.json");
  //     const data = await request.json();

  //     let filtered;

  //     if (type === "caption") {
  //       filtered = data.filter((photo: MockFile) =>
  //         photo.caption.toLowerCase().includes(query!.toLowerCase())
  //       );
  //     } else if (type === "tags") {
  //       const tagsArr = query?.split(",");
  //       console.log(tagsArr);
  //       filtered = data.filter((photo: MockFile) =>
  //         tagsArr?.every((tag: string) => photo.tags.includes(tag))
  //       );
  //     }

  //     if (collection !== null) {
  //       filtered = filtered.filter(
  //         (photo: MockFile) => photo.collection === collection
  //       );
  //     }
  //     if (startDate !== null && endDate !== null) {
  //       filtered = filtered.filter(
  //         (photo: MockFile) => photo.date > startDate && photo.date < endDate
  //       );
  //     }
  //     setPhotos(filtered);
  //     setLoading(false);
  //     const searchAccum: string[] = [];
  //     Object.keys(queryParams).forEach((key) => {
  //       const value = queryParams[key as keyof QueryParams];
  //       if (value !== null) {
  //         if (key.includes("Date")) {
  //           const splitted = key.split(/(?=[A-Z])/);
  //           const realKey = `${splitted[0]} ${splitted[1].toLowerCase()}`;
  //           searchAccum.push(`${realKey}=${value}`);
  //         } else {
  //           searchAccum.push(`${key}=${value}`);
  //         }
  //       }
  //     });
  //     // setSearchString(searchAccum.join(", "));
  //   })();

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

  return (
    <>
      <h6 className="mt-3 mb-3">
        {/* {loading
          ? "Loading results"
          : fetched
          ? "No photos match this query"
          : `Search results for ${searchString}`} */}
      </h6>
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
