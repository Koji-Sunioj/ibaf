import { useState } from "react";
import { collections } from "../utils/searchLists";
import { MockFile } from "../utils/types";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";

import { useDispatch } from "react-redux";
import { setFilter } from "../redux/slices/filter";

import { useNavigate } from "react-router-dom";
import { resetPhotos } from "../redux/slices/photos";

const Collections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<null | MockFile[]>(null);

  photos === null &&
    (async () => {
      const request = await fetch("188.json");
      const data = await request.json();
      setPhotos(data);
    })();

  const collectionObject: { [index: string]: number } = {};

  for (const key of collections) {
    if (!key.includes("All collections")) {
      collectionObject[key.trim()] = 0;
      if (photos !== null) {
        photos.forEach((photo: MockFile) => {
          if (photo.collection.trim() === key.trim()) {
            collectionObject[key.trim()]++;
          }
        });
      }
    }
  }

  return (
    <>
      <h2>Browse Collections</h2>
      {photos !== null &&
        Object.keys(collectionObject).map((key) => (
          <Row>
            <Link
              to={`/results?collection=${key}&type=tags`}
              onClick={(event) => {
                event?.preventDefault();
                dispatch(resetPhotos());
                dispatch(setFilter({ directRefer: true, query: "" }));
                const params = {
                  pathname: "/results",
                  search: `?collection=${key}&type=tags`,
                };
                navigate(params);
              }}
            >
              {key}
            </Link>
            <p>{collectionObject[key]} images</p>
          </Row>
        ))}
    </>
  );
};

export default Collections;
