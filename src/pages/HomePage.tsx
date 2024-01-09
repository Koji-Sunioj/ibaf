import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { TAppState } from "../utils/types";
import { AppDispatch } from "../redux/store";

import SearchBar from "../components/SearchBar";
import { setFilter } from "../redux/slices/filter";

const HomePage = () => {
  const { data, loading, error } = useSelector(
    (state: TAppState) => state.photos
  );
  const filter = useSelector((state: TAppState) => state.filter);
  const { caption, tags, collection, hideRange, endDate, startDate } = filter;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const shouldFetch = data === null && !loading && !error;

  shouldFetch &&
    (() => {
      dispatch(setFilter(filter));
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

  const photoLength = data === null ? 0 : data.length;

  return (
    <>
      <h1 className="mt-3" style={{ textAlign: "center" }}>
        Welcome to the Collection
      </h1>
      <p style={{ textAlign: "center" }}>
        We have more than 31,000 photos as of December 2022
      </p>
      <div>
        <SearchBar origin={"home"} search={search} count={photoLength} />
      </div>
    </>
  );
};

export default HomePage;
