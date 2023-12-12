import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setFilter } from "../redux/slices/filter";

import { TAppState } from "../utils/types";
import { AppDispatch } from "../redux/store";
import { Row, Col } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import { fetchPhotos, resetPhotos, getCount } from "../redux/slices/photos";

const HomePage = () => {
  const { data, loading, error, count } = useSelector(
    (state: TAppState) => state.photos
  );
  const filter = useSelector((state: TAppState) => state.filter);
  const { caption, tags, collection, hideRange, endDate, startDate } = filter;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const shouldFetch = count === null;

  shouldFetch &&
    (() => {
      dispatch(getCount(filter));
    })();

  const search = () => {
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

  const photoLength = count !== null ? count : 0;

  return (
    <>
      <h1 className="mt-3" style={{ textAlign: "center" }}>
        Welcome to the Collection
      </h1>
      <p style={{ textAlign: "center" }}>
        We have more than photos as of December 2022
      </p>
      <div>
        <SearchBar origin={"home"} search={search} count={photoLength} />
      </div>
    </>
  );
};

export default HomePage;
