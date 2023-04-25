import { useState } from "react";

const Testing = () => {
  const [tests, setTests] = useState<any>(null);

  tests === null &&
    (async () => {
      const data = await fetch("/188.json");
      const response = await data.json();
      setTests(response);
    })();

  return (
    <>
      {tests !== null &&
        tests.map((test: any) => (
          <div style={{ border: "1px solid red" }}>
            <p>
              <strong>file id: {test.photoId}</strong>
            </p>
            <p>
              <strong>
                file path: {test.file.replace("/188imagesjpeg/", "")}
              </strong>
            </p>
            <img src={test.file} alt={test.file} />
          </div>
        ))}
    </>
  );
};

export default Testing;
