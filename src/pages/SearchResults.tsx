import { useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import SearchBar from "../components/SearchBar";
import { refinedTags } from "../utils/searchLists";

import { MockFile, TAppState, TFilterState } from "../utils/types";
import { useSelector, useDispatch } from "react-redux";

import { setFilter } from "../redux/slices/filter";

import { fetchPhotos, resetPhotos } from "../redux/slices/photos";

const SearchResults = () => {
  const dispatch = useDispatch<any>();
  const { data, loading } = useSelector((state: TAppState) => state.photos);
  const {
    collection,
    caption,
    tags,
    startDate,
    endDate,
    directRefer,
    hideRange,
  } = useSelector((state: TAppState) => state.filter);
  const navigate = useNavigate();
  const filter = useSelector((state: TAppState) => state.filter);

  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams: Omit<TFilterState, "hideRange" | "directRefer"> = {
    caption: searchParams.get("caption") || caption,
    tags: searchParams.get("tags") || tags,
    collection: searchParams.get("collection") || collection,
    startDate: searchParams.get("startDate") || startDate,
    endDate: searchParams.get("endDate") || endDate,
  };

  const constructParams = () => {
    const queryCopy = {};
    Object.assign(queryCopy, {
      collection: queryParams.collection,
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
    if (queryParams.caption.length > 0) {
      Object.assign(queryCopy, {
        caption: queryParams.caption,
      });
    }
    if (queryParams.tags.length > 0) {
      Object.assign(queryCopy, {
        tags: queryParams.tags,
      });
    }
    return queryCopy;
  };

  useEffect(() => {
    if (directRefer) {
      console.log("direct");
      const queryCopy = constructParams();
      setSearchParams(queryCopy);
      const hasDates = queryCopy.hasOwnProperty("startDate");
      hasDates && Object.assign(queryCopy, { hideRange: false });
      dispatch(setFilter({ ...queryCopy, directRefer: false }));
    } else {
      console.log("fetching");
      const shouldFetch = data === null && !loading;
      shouldFetch && dispatch(fetchPhotos(filter));
    }
  });

  const search = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      currentTarget: {
        query: { value: newQuery },
      },
    } = event;
    let queryString = "";

    /* if (
      (type === "tags" && refinedTags["All collections"].includes(newQuery)) ||
      (type === "tags" &&
        query
          .split(",")
          .every((tag) => refinedTags["All collections"].includes(tag)))
    ) {
      const tagsArray = query.length > 0 ? query.split(",") : [];
      newQuery.length > 0 && tagsArray.push(newQuery);
      dispatch(setFilter({ query: tagsArray.join(","), type: "tags" }));
      queryString += tagsArray.join(",");
      (document.getElementById("query-input") as HTMLInputElement).value = "";
    } else if (type === "caption" && newQuery.length > 0) {
      dispatch(setFilter({ query: newQuery, type: "caption" }));
      queryString += newQuery;
    }
    const newParams = {};
    Object.assign(newParams, {
      query: queryString,
      collection: collection,
      type: type,
    });
    if (!hideRange) {
      Object.assign(newParams, { startDate: startDate, endDate: endDate });
    }
    dispatch(resetPhotos());
    setSearchParams(newParams); */
  };

  /*   const removeTag = (buttonTag: string) => {
    const tagsArray = query.split(",");
    const withThatTag = tagsArray.filter((tag) => tag !== buttonTag);
    const newParams = {};
    Object.assign(newParams, {
      query: withThatTag.join(","),
      collection: collection,
      type: type,
    });
    if (!hideRange) {
      Object.assign(newParams, { startDate: startDate, endDate: endDate });
    }
    dispatch(setFilter({ query: withThatTag.join(","), type: "tags" }));
    dispatch(resetPhotos());
    setSearchParams(newParams);
  }; */
  /*
  const addTag = (buttonTag: string) => {
    const tagsArray = query.length > 0 ? query.split(",") : [];
    tagsArray.push(buttonTag);
    const newParams = {};
    Object.assign(newParams, {
      query: tagsArray.join(","),
      collection: collection,
      type: type,
    });
    if (!hideRange) {
      Object.assign(newParams, { startDate: startDate, endDate: endDate });
    }
    dispatch(setFilter({ query: tagsArray.join(","), type: "tags" }));
    dispatch(resetPhotos());
    setSearchParams(newParams);
    window.scrollTo(0, 0);
  };

  const concatenateTags = (data: MockFile[]) => {
    const narrowedTags: string[] = [];
    data.forEach((photo: MockFile) => {
      photo.tags.forEach((tag) => {
        if (!narrowedTags.includes(tag)) {
          narrowedTags.push(tag);
        }
      });
    });
    narrowedTags.sort();
    return narrowedTags;
  };

  const selectedTags =
    type === "tags" &&
    query.length > 0 &&
    data !== null &&
    searchParams.get("collection") === collection
      ? concatenateTags(data)
      : refinedTags[collection as keyof typeof refinedTags]; */

  console.log(data);

  return (
    <>
      {/* <div className="mt-3 mb-3">
        <SearchBar
          selectedTags={selectedTags}
          origin={"results"}
          search={search}
          removeTag={removeTag}
        />
      </div> */}
      {loading && <h6> loading results...</h6>}
      {data !== null &&
        data.map((photo: MockFile) => (
          <Card className="mb-3">
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
                      /* addTag(tag); */
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
