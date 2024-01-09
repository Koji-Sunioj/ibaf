import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { MockFile } from "../utils/types";
import { useDispatch } from "react-redux";
import { resetPhotos } from "../redux/slices/photos";
import { resetFilter } from "../redux/slices/filter";

import { useSelector } from "react-redux";
import { TAppState } from "../utils/types";
import { getParams } from "../utils/functions";

const PhotoPage = () => {
  const dispatch = useDispatch<any>();
  const { photoId } = useParams();
  const navigate = useNavigate();
  const filter = useSelector((state: TAppState) => state.filter);
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

  const goToResultsWTags = (buttonTag: string) => {
    let newTags = "";

    const filterCopy = { ...filter };

    if (
      filterCopy.tags.length > 0 &&
      !filterCopy.tags.split(",").includes(buttonTag)
    ) {
      newTags = filterCopy.tags + `,${buttonTag}`;
    } else {
      newTags = buttonTag;
    }

    filterCopy.tags = newTags;

    const newParams = getParams(filter);

    if (newParams.hasOwnProperty("tags")) {
      newParams["tags"] += `,${buttonTag}`;
    } else {
      newParams["tags"] = `${buttonTag}`;
    }

    dispatch(resetFilter());
    dispatch(resetPhotos());

    const { caption, tags, collection, hideRange, endDate, startDate } =
      filterCopy;
    let searchString = `?collection=${collection}`;
    searchString =
      caption.length > 0 ? searchString + `&caption=${caption}` : searchString;
    searchString =
      tags.length > 0 ? searchString + `&tags=${tags}` : searchString;
    searchString = !hideRange
      ? searchString + `&startDate=${startDate}&endDate=${endDate}`
      : searchString;

    const params = {
      pathname: "/results",
      search: searchString,
    };
    navigate(params);
  };

  const navigateWCollection = (event: any) => {
    event.preventDefault();
    const params = {
      pathname: "/results",
      search: `?collection=${pagePhoto!.collection}`,
    };
    dispatch(resetFilter());
    dispatch(resetPhotos());
    navigate(params);
  };

  return (
    <>
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <button id="back-button">
            <span
              style={{ fontSize: "50px", lineHeight: "20px" }}
              onClick={() => {
                navigate(-1);
              }}
            >
              &#8592;
            </span>
          </button>
        </Col>
      </Row>

      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
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
                    <Link
                      to={`/results?collection=${pagePhoto.collection}`}
                      onClick={navigateWCollection}
                    >
                      {pagePhoto.collection}
                    </Link>
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
                    key={tag}
                    size="sm"
                    style={{ margin: "3px 3px 3px 0px" }}
                    onClick={() => {
                      goToResultsWTags(tag);
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};

export default PhotoPage;
