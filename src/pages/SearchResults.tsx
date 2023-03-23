import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import Card from "react-bootstrap/Card";

const SearchResults = () => {
  const [photos, setPhotos] = useState<null | []>(null);
  const [searchParams] = useSearchParams();

  const queryParams = {
    query: searchParams.get("query") || null,
    collection: searchParams.get("collection") || null,
  };

  queryParams.query !== null &&
    photos === null &&
    (async () => {
      const { query, collection } = queryParams;
      const request = await fetch("photos.json");
      const data = await request.json();
      let filtered = data.filter(
        (photo: any) =>
          photo.title.includes(query) || photo.caption.includes(query)
      );
      if (collection !== null) {
        filtered = filtered.filter(
          (photo: any) => photo.collection === collection
        );
      }
      setPhotos(filtered);
    })();

  console.log(photos);
  return (
    <>
      <h2 className="mt-3 mb-3">Search Results</h2>
      {photos !== null &&
        photos.map((photo: any) => (
          <Card style={{ width: "18rem" }} className="mb-3">
            <Card.Img variant="top" src={photo.url} />
            <Card.Body>
              <Card.Title>{photo.title}</Card.Title>
              <Card.Text className="mb-1">{photo.caption}</Card.Text>
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
