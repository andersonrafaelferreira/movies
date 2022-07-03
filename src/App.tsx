import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

import Pagination from "react-responsive-pagination";
import "./pagination.css";

function App() {
  const [totalPages, setTotalPages] = useState(17);

  const [currentPage, setCurrentPage] = useState(4);
  const [defaultValue, setDefaultValue] = useState("");

  async function asyncFetchData(term?: string) {
    console.log("here?", term);

    const result = await fetch("http://localhost:8080/movies");
    const jsoned = await result.json();
    console.log(jsoned, "movies");
  }

  const debounced = useDebouncedCallback(
    (value) => {
      asyncFetchData(value);
    },
    500,
    { maxWait: 2000 }
  );

  // When the component goes to be unmounted, we will fetch data if the input has changed.
  useEffect(
    () => () => {
      debounced.flush();
    },
    [debounced]
  );

  return (
    <div className="App">
      <input
        defaultValue={defaultValue}
        onChange={(e) => debounced(e.target.value)}
      />
      <Pagination
        current={currentPage}
        total={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default App;
