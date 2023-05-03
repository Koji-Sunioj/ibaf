import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { collections } from "../utils/searchLists";

import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const [currentTagGroup, setCurrentTagGroup] = useState("All collections");
  const [searchType, setSearchType] = useState("caption");
  const [hideRange, setHideRange] = useState(true);
  const [startDate, setStartDate] = useState("1890");
  const [endDate, setEndDate] = useState("1938");
  const navigate = useNavigate();

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
    }
  };

  return (
    <>
      <h1 className="mt-3" style={{ textAlign: "center" }}>
        Welcome to the EBAF Collection
      </h1>
      <p style={{ textAlign: "center" }}>
        We have more than 31,000 photos as of December 2022
      </p>
      <div>
        <SearchBar
          origin={"home"}
          search={search}
          endDate={endDate}
          startDate={startDate}
          searchType={searchType}
          hideRange={hideRange}
          currentTagGroup={currentTagGroup}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          setCurrentTagGroup={setCurrentTagGroup}
          setSearchType={setSearchType}
          setHideRange={setHideRange}
        />
      </div>
    </>
  );
};

export default HomePage;
