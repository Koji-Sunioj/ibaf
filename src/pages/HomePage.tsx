import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const search = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      currentTarget: {
        query: { value: query },
        collection: { value: collection },
      },
    } = event;

    let searchString = "";
    if (
      ["holy sepulchre", "damascus gate", "western wall"].includes(collection)
    ) {
      searchString = `&collection=${collection}`;
    }

    if (query.length > 0) {
      const params = {
        pathname: "/results",
        search: `query=${query}${searchString}`,
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
        <Form onSubmit={search}>
          <InputGroup className="mb-3" hasValidation={false}>
            <InputGroup.Text>Search: </InputGroup.Text>
            <Form.Control placeholder="title, caption..." name="query" />
            <Form.Select name="collection">
              <option>select a collection</option>
              <option value="holy sepulchre">Holy Sepulchre</option>
              <option value="damascus gate">Damascus Gate</option>
              <option value="western wall">Western Wall</option>
            </Form.Select>
          </InputGroup>
        </Form>
      </div>
    </>
  );
};

export default HomePage;
