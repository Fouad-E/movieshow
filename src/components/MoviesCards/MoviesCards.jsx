import React, { useEffect, useState } from 'react';
import { Card, CardImg, CardBody, CardTitle, Button, CardSubtitle} from 'reactstrap';
import { BiLike, BiDislike, BiMessageSquareError} from 'react-icons/bi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FcLike, FcDislike } from 'react-icons/fc';


import { movies$ } from '../../data/movies';
import imageMovie from '../../images/imageMovie.png';

import './moviesCards.css';

const MoviesCards = (props) => {
    
    const [movies, setMovies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [moviesByCategory, setMoviesByCategory] = useState([]); 
    const [ likedMovies, setLinkedMovies] = useState([]);
    const [categoryChoosen, setCategoryChoosen] = useState("All");

    useEffect(() => {
        let mounted = true;

        movies$.then(movies => {
            movies.forEach(movie => {
                movie.isLinked = true;
                if(!categories.includes(movie.category)){
                    categories.push(movie.category);
                    setCategories(categories);
                }
            });
            setMovies(movies);
            setMoviesByCategory(movies);

            console.log("Movies : ", movies);
            console.log("category movies : ", categories);

        })
        return () => mounted = false;

    }, []);

    function removeMovie(movie){
        for(var i=0; i<movies.length; i++){
            if(movies[i].id === movie.id){
                setMovies(movies.splice(i, 1));
                console.log("Index supprimé : ", i);
            }
        }
        console.log("Movies mis à jour après suppression: ", movies);
    }

    function handleLikeMovie(movie){
        movies.forEach(movieElement => {
            if(movieElement.id === movie.id){
                movie.isLinked = !movie.isLinked;
                console.log("Like movie indexed modified !!", movieElement);
            }            
        });
        setMovies(movies);
        console.log("Like movies mis à jour après click: ", movies);
    }


    function handleChangeCategory(e) {
        setCategoryChoosen(e.target.value);
        console.log("Catehory choosen : ", categoryChoosen);

        let moviesByCategory = [];
        movies.forEach((movie) => {
            if(movie.category === e.target.value){
                moviesByCategory.push(movie);
            }
        })
        setMoviesByCategory(moviesByCategory);
    }

    return(
        <div>
            <label for="movie-select">Choose a category of movies :</label>

            <select name="movies" id="movie-select" onChange={handleChangeCategory}>
                <option value="All">All</option>
                {
                    categories.map((category) => 
                        <option value={category}>{category}</option>
                    )
                }
            </select>

            <div id="moviesCards">
            {
                movies.map((movie) => 
                <Card key={movie.id} className="movieCard">
                    <CardImg top width="100%" src={imageMovie} alt="Image movie" />
                    <CardBody>
                        <CardTitle className="titleMovie"> {movie.title} </CardTitle>
                        <CardSubtitle> {movie.category} </CardSubtitle>
                        <BiLike /> {movie.likes}
                        &nbsp; | &nbsp;
                        <BiDislike /> {movie.dislikes}
                        &nbsp;
                        <Button onClick={() => handleLikeMovie(movie)}>
                            { movie.isLinked ? <FcLike/> : <FcDislike /> }
                        </Button>
                        &nbsp;
                        <Button onClick={() => removeMovie(movie)}>
                            <RiDeleteBin5Line />
                        </Button>
                    </CardBody>
                </Card>
                )
            }
            </div>

        </div>
    );
}

export default MoviesCards;