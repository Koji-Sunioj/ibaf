import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setFilter } from "../redux/slices/filter";

import { TAppState } from "../utils/types";

import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const { type, query, collection, hideRange, endDate, startDate } =
    useSelector((state: TAppState) => state.filter);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const search = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      currentTarget: {
        query: { value: query },
      },
    } = event;

    if (query.length > 0) {
      dispatch(setFilter({ query: query }));
      const searchString = `&collection=${collection}`;
      const dateString = !hideRange
        ? `&startDate=${startDate}&endDate=${endDate}`
        : "";
      const params = {
        pathname: "/results",
        search: `query=${query}&type=${type}${searchString}${dateString}`,
      };
      navigate(params);
    }
  };

  return (
    <>
      <h1 className="mt-3" style={{ textAlign: "center" }}>
        Welcome to the Collection
      </h1>
      <p style={{ textAlign: "center" }}>
        We have more than 31,000 photos as of December 2022
      </p>
      <div>
        <SearchBar origin={"home"} search={search} />
      </div>
    </>
  );
};

export default HomePage;
