import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const collections = [
    "Couvent St. Etienne",
    "Couvent St. Etienne / Charles Prickartz",
    "Couvent St. Etienne /  Sainte-Anne",
    "Couvent St. Etienne / Jesuit",
    "Couvent St. Etienne / The Sainte-Anne Collection ",
    "Couvent St. Etienne /  Notre-Dame de France",
    "Couvent St. Etienne / Paulus-Haus",
    "Couvent St. Etienne / JOURDAIN COULEURS",
    "Couvent St. Etienne / Bethléem coloriée",
  ];

  const search = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      currentTarget: {
        query: { value: query },
        collection: { value: collection },
      },
    } = event;

    let searchString = "";
    if (collections.includes(collection)) {
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
              {collections.map((collection) => (
                <option value={collection} key={collection}>
                  {collection}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Form>
      </div>
    </>
  );
};

export default HomePage;
