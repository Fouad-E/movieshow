import React, { useEffect, useState } from 'react';
import { Card, CardImg, CardBody, CardTitle, Button, CardSubtitle} from 'reactstrap';
import { BiLike, BiDislike} from 'react-icons/bi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FcLike, FcDislike } from 'react-icons/fc';


import { movies$ } from '../../data/movies';
import imageMovie from '../../images/imageMovie.png';

const MoviesCards = (props) => {
    
    const [movies, setMovies] = useState([]);
    const [ likedMovies, setLinkedMovies] = useState([]);
    useEffect(() => {
        movies$.then(movies => {
            setMovies(movies);
            console.log("Movies : ", movies);

            movies.forEach(movie => {
                likedMovies[movie.id] = true
            });
            setLinkedMovies(likedMovies);
            console.log("Linked movies : ", likedMovies);
        })

    });

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
                likedMovies[movie.id] = !likedMovies[movie.id];
                console.log("Like movie indexed modified !!", movieElement);
            }            
        });
        setLinkedMovies(likedMovies);
        console.log("Like movies mis à jour après click: ", likedMovies);
    }


    return(
        <div>
            {
                movies.map((movie) => 
                <Card key={movie.id}>
                    <CardImg top width="100%" src={imageMovie} alt="Image movie" />
                    <CardBody>
                        <CardTitle className="titleMovie"> {movie.title} </CardTitle>
                        <CardSubtitle> {movie.category} </CardSubtitle>
                        <BiLike /> {movie.likes}
                        &nbsp; | &nbsp;
                        <BiDislike /> {movie.dislikes}
                        
                        <Button onClick={() => handleLikeMovie(movie)}>
                            { likedMovies[movie.id] ? <FcLike/> : <FcDislike/> }
                        </Button>
                        <Button onClick={() => removeMovie(movie)}>
                            <RiDeleteBin5Line />
                        </Button>
                    </CardBody>
                </Card>
                )
            }
        </div>
    );
}

export default MoviesCards;