import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { MockFile } from "../utils/types";

const PhotoPage = () => {
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
                style={{ margin: "3px 3px 3px 0px" }}
                onClick={() => {
                  const params = {
                    pathname: "/results",
                    search: `query=${tag}&type=tags`,
                  };

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
