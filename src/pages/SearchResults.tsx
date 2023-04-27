import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { MockFile, QueryParams } from "../utils/types";

const SearchResults = () => {
  const [searchString, setSearchString] = useState("");
  const [photos, setPhotos] = useState<null | []>(null);
  const [searchParams] = useSearchParams();

  const queryParams = {
    query: searchParams.get("query") || null,
    collection: searchParams.get("collection") || null,
    startDate: searchParams.get("start-date") || null,
    endDate: searchParams.get("end-date") || null,
  };

  queryParams.query !== null &&
    photos === null &&
    (async () => {
      const { query, collection, startDate, endDate } = queryParams;
      const request = await fetch("188.json");
      const data = await request.json();
      let filtered = data.filter(
        (photo: MockFile) =>
          photo.caption.includes(query!) ||
          photo.tags.includes(query?.toLowerCase()!)
      );
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

  return (
    <>
      <h4 className="mt-3 mb-3">
        {photos !== null &&
          (photos.length === 0
            ? "No photos match this query"
            : `Search results for ${searchString}`)}
      </h4>
      {photos !== null &&
        photos.map((photo: MockFile) => (
          <Card className="mb-3">
            <Card.Img variant="bottom" src={photo.file} alt={photo.file} />
            <Card.Body>
              <Card.Title>{photo.photoId}</Card.Title>
              <Card.Text className="mb-1">{photo.caption}</Card.Text>
              <Card.Text className="mb-1">
                {photo.tags.map((tag: string) => (
                  <Button
                    key={photo.photoId + tag}
                    style={{ margin: "3px 3px 3px 0px" }}
                  >
                    {tag}
                  </Button>
                ))}
              </Card.Text>
              <Card.Text className="text-muted mb-1">
                date: {photo.date}
              </Card.Text>
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
