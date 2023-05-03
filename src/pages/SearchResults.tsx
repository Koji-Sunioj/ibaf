import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import SearchBar from "../components/SearchBar";

import { collections } from "../utils/searchLists";

import { useNavigate } from "react-router-dom";

import { MockFile, QueryParams, SearchParams } from "../utils/types";

const SearchResults = () => {
  const navigate = useNavigate();

  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<null | []>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const shouldHide =
    searchParams.get("startDate") === null &&
    searchParams.get("endDate") === null;

  const [currentTagGroup, setCurrentTagGroup] = useState(
    searchParams.get("collection") || "All collections"
  );
  const [searchType, setSearchType] = useState(
    searchParams.get("type") || "caption"
  );
  const [hideRange, setHideRange] = useState(shouldHide);
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || "1890"
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "1938");

  const queryParams = {
    query: searchParams.get("query") || null,
    type: searchParams.get("type") || null,
    collection: searchParams.get("collection") || null,
    startDate: searchParams.get("startDate") || null,
    endDate: searchParams.get("endDate") || null,
  };

  queryParams.query !== null &&
    photos === null &&
    !loading &&
    (async () => {
      setLoading(true);
      const { query, collection, startDate, endDate, type } = queryParams;
      const request = await fetch("188.json");
      const data = await request.json();

      let filtered;

      if (type === "caption") {
        filtered = data.filter((photo: MockFile) =>
          photo.caption.toLowerCase().includes(query!.toLowerCase())
        );
      } else if (type === "tags") {
        const tagsArr = query?.split(",");
        console.log(tagsArr);
        filtered = data.filter((photo: MockFile) =>
          tagsArr?.every((tag: string) => photo.tags.includes(tag))
        );
      }

      if (collection !== null) {
        filtered = filtered.filter(
          (photo: MockFile) => photo.collection === collection
        );
      }
      if (startDate !== null && endDate !== null) {
        filtered = filtered.filter(
          (photo: MockFile) => photo.date > startDate && photo.date < endDate
        );
      }
      setPhotos(filtered);
      setLoading(false);
      const searchAccum: string[] = [];
      Object.keys(queryParams).forEach((key) => {
        const value = queryParams[key as keyof QueryParams];
        if (value !== null) {
          if (key.includes("Date")) {
            const splitted = key.split(/(?=[A-Z])/);
            const realKey = `${splitted[0]} ${splitted[1].toLowerCase()}`;
            searchAccum.push(`${realKey}=${value}`);
          } else {
            searchAccum.push(`${key}=${value}`);
          }
        }
      });
      setSearchString(searchAccum.join(", "));
    })();

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
      dateString = `&startDate=${startDate}&endDate=${endDate}`;
    }

    if (query.length > 0) {
      const params = {
        pathname: "/results",
        search: `query=${query}&type=${searchType}${searchString}${dateString}`,
      };
      navigate(params);
      setPhotos(null);
    }
  };

  const fetched = photos !== null && photos.length === 0;

  return (
    <>
      <h6 className="mt-3 mb-3">
        {loading
          ? "Loading results"
          : fetched
          ? "No photos match this query"
          : `Search results for ${searchString}`}
      </h6>
      <div>
        <SearchBar
          origin={"results"}
          search={search}
          endDate={endDate}
          startDate={startDate}
          searchType={searchType}
          hideRange={hideRange}
          currentTagGroup={currentTagGroup}
          query={searchParams.get("query") || ""}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          setCurrentTagGroup={setCurrentTagGroup}
          setSearchType={setSearchType}
          setHideRange={setHideRange}
        />
      </div>

      {photos !== null &&
        photos.map((photo: MockFile) => (
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

                      if (queryCopy.type === "tags") {
                        const existingTags = queryCopy.query!.split(",");
                        if (!existingTags.includes(tag)) {
                          queryCopy.query += `,${tag}`;
                        }
                      } else {
                        queryCopy.query = tag;
                        queryCopy.type = "tags";
                      }
                      const withOutNulls = queryCopy as SearchParams;
                      setPhotos(null);
                      setSearchParams(withOutNulls);
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
