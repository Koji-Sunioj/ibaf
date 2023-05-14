import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { MockFile } from "../utils/types";
import { useDispatch } from "react-redux";
import { resetPhotos } from "../redux/slices/photos";
import { setFilter } from "../redux/slices/filter";

const PhotoPage = () => {
  const dispatch = useDispatch();
  const { photoId } = useParams();
  const navigate = useNavigate();
  const [pagePhoto, setpagePhoto] = useState<MockFile | null>(null);

  pagePhoto === null &&
    (async () => {
      const request = await fetch("/188.json");
      const data = await request.json();
      const selectedPhoto = data.find((photo: MockFile) =>
        photo.photoId.includes(photoId!)
      );

      setpagePhoto(selectedPhoto);
    })();

  return (
    <>
      {pagePhoto !== null && (
        <Card className="mt-3">
          <Card.Img variant="top" src={pagePhoto.file} />
          <Card.Body>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <p>
                <strong>photo id: </strong>
                {pagePhoto.photoId}
              </p>
              <p>
                <strong>collection: </strong>
                {pagePhoto.collection}
              </p>
              <p>
                <strong>date: </strong>
                {pagePhoto.date}
              </p>
            </div>
            <Card.Text>
              <strong>caption: </strong>
              {pagePhoto.caption}
            </Card.Text>
            {pagePhoto.tags.map((tag) => (
              <Button
                size="sm"
                style={{ margin: "3px 3px 3px 0px" }}
                onClick={() => {
                  const params = {
                    pathname: "/results",
                    search: `?collection=${pagePhoto.collection}&type=tags&query=${tag}`,
                  };
                  dispatch(setFilter({ directRefer: true, hideRange: true }));
                  dispatch(resetPhotos());
                  navigate(params);
                }}
              >
                {tag}
              </Button>
            ))}
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default PhotoPage;
