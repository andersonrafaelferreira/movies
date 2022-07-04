import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

import Pagination from "react-responsive-pagination";
import "./pagination.css";

import {Inputer, Wrapper, Card, CardWrapper, Info, Mark, Text, Title, Content, ImageWrapper, Image} from './styles'

function App() {
  const [allfilms, setAllFilms] = useState<Array<MovieTypes>>([]);
  const [films, setFilms] = useState<Array<MovieTypes>>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [defaultValue, setDefaultValue] = useState<string>("");

  type MovieTypes = {
    coverImage: string;
    description: string;
    director: string;
    id:  string;
    title: string;
    year: number;
  }

  

  async function asyncFetchData(term?: string) {
    console.log("here?", term);
    setCurrentPage(1);
    
    if(term){
      const result = await fetch(`http://localhost:8080/movies?q=${term}`);
      const movies = await result.json();
      setAllFilms(movies);
      
      filtered(movies)
    }else{
      const result = await fetch("http://localhost:8080/movies");
      const movies = await result.json();
      setAllFilms(movies);
      
      filtered(movies)
    }

    function filtered(movies: MovieTypes[]) {
      let splited = Math.ceil(movies.length / perPage)
      setTotalPages(splited)
      let chunk = movies.slice(+currentPage -1, +currentPage + 9)
      setFilms(chunk);
    }

  }
  
  function changePage(movies: MovieTypes[]) {
    let splited = Math.ceil(movies.length / perPage)
    setTotalPages(splited)
    let chunk = movies.slice(+currentPage -1, +currentPage + 9)
    setFilms(chunk);
  }

  useEffect(()=>{
    asyncFetchData()
  },[])

  useEffect(()=>{
    if(currentPage) changePage(allfilms)
  },[currentPage])

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
    <>
      <Wrapper>
        <Inputer
          defaultValue={defaultValue}
          onChange={(e) => debounced(e.target.value)}
        />
      </Wrapper>
      <CardWrapper>
        {films.length === 0 && <Title>no movies found :(</Title>}
        {films.map((film: MovieTypes) =>(
          <Card key={film.id}>
            <ImageWrapper>
              <Image src={film.coverImage} />
            </ImageWrapper>
            <Content>
              <Title>
                {film.title}
              </Title>
              <Info>
                <Text>{film.director}</Text>
                <Mark>{film.year}</Mark>
              </Info>
            </Content>
          </Card>
        ))}

        
      </CardWrapper>

      <Pagination
          current={currentPage}
          total={totalPages}
          onPageChange={setCurrentPage}
        />
    </>
  );
}

export default App;
