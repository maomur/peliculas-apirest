import WishMovies from "./classes/WishMovie.js";

class MovieApp {

    wishMovies = [];
    inputName = document.querySelector('#inputName');
    inputLanguage = document.querySelector('#inputLanguage');
    inputSubmit = document.querySelector('#btnSubmit');
    galeryBox = document.querySelector('#galery-box');
    searchForm = document.querySelector('#formDiv');
    wishList = document.querySelector('#whish-list');
    
    
    constructor(){
        
        this.searchForm.addEventListener('submit', (e)=> this.handleSearchSubmit(e));
        this.inputName.focus();
        this.getMoviesFromLS();  //perfecto
    }


        getMoviesFromLS(){
            let moviesFromLS = JSON.parse(localStorage.getItem('wish_movies')); //PERFECTO

            if(moviesFromLS === null){
                moviesFromLS = [];
            }

            this.wishMovies = moviesFromLS.map( (movie)=> {
                const newWishMovies = new WishMovies(movie.id, movie.title);
                return newWishMovies
            });

            this.printWishMovies();
        
        }

        handleSearchSubmit(e){
            e.preventDefault();
            
            const formData = this.getSearchFormData();
            const [movieTitle, inputLanguage] = formData;
            this.getMovies(movieTitle, inputLanguage);
  
        }

        getSearchFormData(){
            const titleValue = this.inputName.value.trim();
            const languageValue = this.inputLanguage.value.trim();
            if(!titleValue){
                return alert('mal!!');
            }
            return [titleValue, languageValue];
        }

        




    getMovies = (title, language = "es")=> {
        
        // const movieTitle = arrayDatos[0];
        // const movieGenre = arrayDatos[1];

        fetch(`https://api.themoviedb.org/3/search/movie?api_key=89815e32bf48c17138ec7854f6b77ada&query=${title}&language=${language}`)
        .then( (respuesta) => {return respuesta.json()})
        .then( (data) => {
            if(data.total_results !== 0){
                const findedMovies = data.results.splice(0,12).map( (movie)=> {
                        return {                        
                        title: movie.title,
                        description: movie.overview,
                        id: movie.id,
                        genre: movie.genre_ids,
                        poster: movie.poster_path,
                        rank: movie.vote_average
                    }
                })          

                this.printFindedMovies(findedMovies);


            } else{
                alert("No hay películas con estos datos")
            }

        })
        .catch((err)=> console.log(err))
    }

    printFindedMovies(findedMovies){
        this.galeryBox.innerHTML = ``;

        findedMovies.forEach( (movie)=> {
            const movieDom = document.createElement('article');
            movieDom.classList.add('position-relative');

            const checkedPosterUrl = movie.poster === null ? `https://raw.githubusercontent.com/julien-gargot/images-placeholder/master/placeholder-portrait.png` : `https://image.tmdb.org/t/p/w500${movie.poster}`;

            const addToWishListIcon = document.createElement('i');
            addToWishListIcon.className = "bi bi-plus-circle-fill fs-2 plus";

            addToWishListIcon.addEventListener('click', ()=> {
                this.createWishMovie(movie.id, movie.title);
            })

            movieDom.innerHTML =   `
            <img class="fluid" src="${checkedPosterUrl}" alt="${movie.poster}">
            <i class="bi bi-star-fill rank">  ${movie.rank}</i>
            <br>
            `;
            movieDom.append(addToWishListIcon);

            this.galeryBox.append(movieDom);   
            
            this.printWishMovies();
        })
    }

    createWishMovie(id, title){

        if(this.wishMovies.some( (movie)=> { return movie.id === id})){
            return;
        }

        const newWishMovie = new WishMovies(id, title);
        this.wishMovies.push(newWishMovie);

        localStorage.setItem('wish_movies', JSON.stringify(this.wishMovies));
         //PERFECTO!!
        this.printWishMovies();

    }

    printWishMovies(){ //PERFECTO
        this.wishList.innerHTML = `<h2 class="m-3 fs-4 text-primary">Mis Películas</h2>`;
        
        this.wishMovies.forEach( (movie)=>{

            const wishMovieItem = document.createElement('article');
            wishMovieItem.classList.add('wish-movie');
            wishMovieItem.innerHTML = 
            `
            <div class="border-item">
                <h2 class="fs-4 p-2 d-flex justify-content-start">${movie.title}<span class="ms-auto">⬛</span><span class="mx-1">❌</span></h2>
            </div>    
            `;
            this.wishList.append(wishMovieItem);
        })
    }






}

new MovieApp;