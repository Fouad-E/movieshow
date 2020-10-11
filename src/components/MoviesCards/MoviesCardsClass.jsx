import React, { Component } from 'react';
import { Card, CardImg, CardBody, CardTitle, Input, Label, FormGroup, Col, Button, CardSubtitle, Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import { BiLike, BiDislike} from 'react-icons/bi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FcLike, FcDislike } from 'react-icons/fc';


import { movies$ } from '../../data/movies';
import imageMovie from '../../assets/images/imageMovie.png';

import './moviesCards.css';

class MoviesCardsClass extends Component {


    constructor(props){
        super(props);
        this.state = {
            movies: [],
            categories : [],
            nbMoviesByCategory: [],
            moviesByCategory: [],
            categoryChoosen: "All",
            nbPages:1,
            nbMaxMoviesCards: 4,
            pageCurrent: 1,
            moviesByNbMaxMoviesCardsByCategory:[],
        }

        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleLikeMovie = this.handleLikeMovie.bind(this);
        this.removeMovie = this.removeMovie.bind(this);
        this.handleChangeNbMaxMoviesCards = this.handleChangeNbMaxMoviesCards.bind(this);
        this.buildAndUpdateMoviesDataWithNbMaxMoviesCards = this.buildAndUpdateMoviesDataWithNbMaxMoviesCards.bind(this);
        this.getPlaginationItems = this.getPlaginationItems.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);

    }

    async componentWillMount(){
        let categories = [];
        let nbMoviesByCategory = [];

        await movies$.then(movies => {
            movies.forEach(movie => {
                movie.isLinked = null;
                if(!categories.includes(movie.category)){
                    categories.push(movie.category);
                    nbMoviesByCategory.push({name: movie.category, nbMovies : 1});
                }else{
                    nbMoviesByCategory.forEach((category) => {
                        if(movie.category===category.name){
                            category.nbMovies +=1;
                        }
                    });
                }
            });
            
            this.setState({categories: categories});
            this.setState({movies: movies});
            this.setState({nbMoviesByCategory: nbMoviesByCategory});
            this.setState({nbMovies: this.state.moviesByCategory.length});
            this.setState({ moviesByCategory : movies});
            this.setState({nbPages: Math.ceil(this.state.moviesByCategory.length/this.state.nbMaxMoviesCards)});

            const pageCurrent = this.state.pageCurrent;
            const nbMaxMoviesCards = this.state.nbMaxMoviesCards;

            this.buildAndUpdateMoviesDataWithNbMaxMoviesCards(nbMaxMoviesCards, pageCurrent);

            console.log("Movies : ", movies);
            console.log("category movies : ", categories);
            console.log("nb movies by category : ", nbMoviesByCategory);
        })
    }

    buildAndUpdateMoviesDataWithNbMaxMoviesCards(nbMaxMoviesCards, pageCurrent){
        this.setState({nbMaxMoviesCards: nbMaxMoviesCards});
        this.setState({pageCurrent: pageCurrent});
        this.setState({nbPages: Math.ceil(this.state.moviesByCategory.length/nbMaxMoviesCards)});

        let moviesByNbMaxMoviesCardsByCategory = [];

        console.log("pageCurrent : ", pageCurrent);

        const moviesByCategory = this.state.moviesByCategory;
        console.log("moviesByCategory : ", moviesByCategory);

        let maxMoviesCards = nbMaxMoviesCards;

        console.log("Max movies cards : ", maxMoviesCards);
        console.log("Page current : ", pageCurrent);
        for(var i=(pageCurrent-1)*nbMaxMoviesCards; i<(maxMoviesCards*pageCurrent) && i<moviesByCategory.length;i++){
            moviesByNbMaxMoviesCardsByCategory.push(moviesByCategory[i]);
            console.log(i);
        }

        this.setState({moviesByNbMaxMoviesCardsByCategory : moviesByNbMaxMoviesCardsByCategory});
    }



    /* Remove one movie after clicking on delete icon */ 
    removeMovie(movie){
        const movies = this.state.movies;
        const nbMoviesByCategory = this.state.nbMoviesByCategory;
        const categories = this.state.categories;

        for(var i=0; i<movies.length; i++){
            if(movies[i].id === movie.id){
                movies.splice(i, 1)
                console.log("Index supprimé : ", i);
            }
        }
        this.setState({movies : movies});
        console.log("Movies mis à jour après suppression: ", movies);

        /* Decrement the number of films of film's category removed
        If there isn't films of this category, this category is automatically removed from multi-select 
        */
        nbMoviesByCategory.forEach((category) => {
            if(movie.category===category.name){
                category.nbMovies-=1;
                if(category.nbMovies <1){
                    const index = categories.indexOf(movie.category);
                    if (index > -1) {
                        categories.splice(index, 1);
                        this.setState({categories: categories});
                        this.setState({moviesByCategory: movies})
                    }
                }
            }
            this.setState({nbMoviesByCategory: nbMoviesByCategory});
            console.log("nb movies by category modified : ", nbMoviesByCategory);
            this.buildAndUpdateMoviesDataWithNbMaxMoviesCards(this.state.nbMaxMoviesCards, this.state.pageCurrent);
        });
    };


    handleLikeMovie(movie){
        const movies = this.state.movies;
        
        movies.forEach(movieElement => {
            if(movieElement.id === movie.id){
                console.log("Like movie indexed modified !!", movieElement);
                if(movie.isLinked == null){
                    movie.likes += 1;
                    movie.isLinked = false;
                }else{
                    if(movie.isLinked){
                        movie.likes += 1;
                        movie.dislikes -=1;
                    }else{
                        movie.likes -= 1;
                        movie.dislikes +=1;
                    }
                    movie.isLinked = !movie.isLinked;
                }
            }
        });

        this.setState({movies : movies});
        console.log("Like movies mis à jour après click: ", movies);
    };


    async handleChangeCategory(e){
        const movies = this.state.movies;
        const categoryChoosen = e.target.value;

        await function(){
            this.setState({categoryChoosen: categoryChoosen});
            console.log("Catehory choosen : ", categoryChoosen);
            if(categoryChoosen==="All"){
                this.setState({moviesByCategory: movies});
            }else{
                let moviesByCategory = [];
                movies.forEach((movie) => {
                    if(movie.category === e.target.value){
                        moviesByCategory.push(movie);
                    }
                })
                this.setState({moviesByCategory: moviesByCategory});
            }
        }

        const nbMaxMoviesCards = this.state.nbMaxMoviesCards; 
        const pageCurrent = this.state.pageCurrent;
        this.buildAndUpdateMoviesDataWithNbMaxMoviesCards(nbMaxMoviesCards, pageCurrent);
    };

    handleChangeNbMaxMoviesCards(e){
        console.log("Nb max cards selected : ", this.state.nbMaxMoviesCards);
        this.buildAndUpdateMoviesDataWithNbMaxMoviesCards(e.target.value, 1);
        const moviesByNbMaxMoviesCardsByCategory = this.state.moviesByNbMaxMoviesCardsByCategory;
        console.log("movies by category with max movies cards : ", moviesByNbMaxMoviesCardsByCategory);
        console.log("Nb max cards selected : ", this.state.nbMaxMoviesCards);
    }

    handleChangePage(e){
        console.log("Current page : ",this.state.pageCurrent);
        console.log("E target value : ", parseInt(e.target.value));
        var pageCurrent = parseInt(e.target.value);
        if(pageCurrent<1){
            pageCurrent=1;
        }
        if(pageCurrent>this.state.nbPages){
            pageCurrent=this.state.nbPages;
        }
                
        this.buildAndUpdateMoviesDataWithNbMaxMoviesCards(this.state.nbMaxMoviesCards, parseInt(pageCurrent));
    }

    getPlaginationItems(){
        let pagesPlaginationItem = [];
        
        for (let i = 1; i <= this.state.nbPages; i++) {
            pagesPlaginationItem.push(
                <PaginationItem>
                    <PaginationLink onClick={this.handleChangePage} value={i}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return pagesPlaginationItem;
    }


    render(){
        const pageCurrent = parseInt(this.state.pageCurrent);
        const nbPages = parseInt(this.state.nbPages);
        return(
            <div>
                <FormGroup row >
                <Col sm={10} className="categories">
                    <Label for="categoriesSelect">Choose a category of movies :</Label>
                    <Input type="select" name="category" id="categoriesSelect" onChange={this.handleChangeCategory}>
                        <option>All</option>
                        {
                            this.state.categories.map((category) => 
                                <option value={category}>{category}</option>
                            )
                        }
                    </Input>
                    </Col>
                </FormGroup>


                <div id="pagination">
                    <div>
                        <Pagination aria-label="Page navigation example">
                            <PaginationItem>
                                <PaginationLink onClick={this.handleChangePage} first value={1} />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink onClick={this.handleChangePage} previous value={pageCurrent - 1}  />
                            </PaginationItem>
                            {this.getPlaginationItems()}
                            <PaginationItem>
                                <PaginationLink onClick={this.handleChangePage} next value={pageCurrent + 1} />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink onClick={this.handleChangePage} last value={nbPages} />
                            </PaginationItem>
                        </Pagination>
                    </div>
                    <div id="maxMoviesCards">
                        <Input type="select" name="select" id="nbMoviesCards" onChange={this.handleChangeNbMaxMoviesCards}>
                            <option> 4 </option>
                            <option> 8 </option>
                            <option> 12 </option>
                        </Input>
                    </div>

                </div>

                
                <div id="moviesCards">
                    {
                        this.state.moviesByNbMaxMoviesCardsByCategory.map((movie) => 
                        <Card key={movie.id} className="movieCard">
                            <CardImg top width="100%" src={imageMovie} alt="Image movie" />
                            <CardBody>
                                <CardTitle className="titleMovie"> {movie.title} </CardTitle>
                                <CardSubtitle> {movie.category} </CardSubtitle>
                                <BiLike /> {movie.likes}
                                &nbsp; | &nbsp;
                                <BiDislike /> {movie.dislikes}
                                <div id="iconButtons">
                                    <Button className="iconButtons" onClick={() => this.handleLikeMovie(movie)}>
                                        { movie.isLinked === true || movie.isLinked === null ? <FcLike/> : <FcDislike /> }
                                    </Button>
                                    &nbsp;
                                    <Button className="iconButtons" onClick={() => this.removeMovie(movie)}>
                                        <RiDeleteBin5Line />
                                    </Button>
                                </div>

                            </CardBody>
                        </Card>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default MoviesCardsClass;