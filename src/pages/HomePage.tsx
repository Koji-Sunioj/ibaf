import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setFilter } from "../redux/slices/filter";

import { TAppState } from "../utils/types";

import { refinedTags } from "../utils/searchLists";

import SearchBar from "../components/SearchBar";
import { resetPhotos } from "../redux/slices/photos";

const HomePage = () => {
  const { data } = useSelector((state: TAppState) => state.photos);
  const { caption, tags, collection, hideRange, endDate, startDate } =
    useSelector((state: TAppState) => state.filter);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const search = (event: any) => {
    let searchString = `?collection=${collection}`;
    searchString =
      caption.length > 0 ? searchString + `&caption=${caption}` : searchString;
    searchString =
      tags.length > 0 ? searchString + `&tags=${tags}` : searchString;
    const params = {
      pathname: "/results",
      search: searchString,
    };
    navigate(params);
    /* event.preventDefault();
    const {
      currentTarget: {
        query: { value: query },
      },
    } = event; */
    /* if (query.length > 0) {
      dispatch(setFilter({ query: query, directRefer: false }));
      data !== null && dispatch(resetPhotos());
      const dateString = !hideRange
        ? `&startDate=${startDate}&endDate=${endDate}`
        : "";
      const params = {
        pathname: "/results",
        search: `?collection=${collection}&type=${type}&query=${query}${dateString}`,
      };
      navigate(params);
    } */
  };

  const removeTag = (buttonTag: string) => {
    const tagsArray = tags.split(",");
    const withThatTag = tagsArray.filter((tag) => tag !== buttonTag);
    dispatch(setFilter({ tags: withThatTag.join(",") }));
  };

  const selectedTags = refinedTags[collection as keyof typeof refinedTags];

  return (
    <>
      <h1 className="mt-3" style={{ textAlign: "center" }}>
        Welcome to the Collection
      </h1>
      <p style={{ textAlign: "center" }}>
        We have more than 31,000 photos as of December 2022
      </p>
      <div>
        <SearchBar
          origin={"home"}
          search={search}
          removeTag={removeTag}
          selectedTags={selectedTags}
        />
      </div>
    </>
  );
};

export default HomePage;
