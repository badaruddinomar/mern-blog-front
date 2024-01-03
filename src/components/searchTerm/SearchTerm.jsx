import { useSelector } from "react-redux";
import SearchBar from "../searchBar/SearchBar";
import Posts from "../posts/Posts";

const SearchTearm = () => {
  const { posts } = useSelector((state) => state.userReducer);
  return (
    <>
      <SearchBar />
      <Posts postData={posts} />
    </>
  );
};

export default SearchTearm;
