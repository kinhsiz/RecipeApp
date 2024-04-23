import './App.css';
import { FormEvent, useEffect, useRef, useState } from "react";
import * as api from './API';
import { Recipe } from './types';
import RecipeCard from "./Components/RecipeCard";
import RecipeModal from './Components/RecipeModal';
import { AiOutlineSearch } from 'react-icons/ai';

type Tabs = "search" | "favorites";

const App = () => {

  // Holds the current search term. Updated via setSearchTerm.
  const [searchTerm, setSearchTerm] = useState<string>("");

  // State for storing recipes fetched from the API. Initializes with an empty array.
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  // Tracks the currently selected recipe for detail viewing.
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  
  // Manages the active tab ('search' or 'favorites').
  const [selectedTab, setSelectedTab] = useState<Tabs>(); 
  
  // Stores user's favorite recipes.
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
 
  // Ref to keep track of the current page number for pagination.
  const pageNumber = useRef(1);

  // Fetches favorite recipes on component mount and updates the state.
  useEffect(() => {
    const fetchFavoriteRecipes = async function() {
      try {
        const favoriteRecipes = await api.getFavoriteRecipes();
        setFavoriteRecipes(favoriteRecipes.results); //return res.json(results);
      } catch (error) {
        console.log(error);
      }
    }
    fetchFavoriteRecipes();
  }, [])

  //eventhandler that call backend endpoint
  //FormEvent are from form elements such as input fields, buttons, and select dropdowns
  const handleSearchSubmit = async (event : FormEvent) => { 
      event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results); // If API call successful, it updates the recipes state variable with the results obtained from the API
      pageNumber.current = 1; //sets page back to one after a new submit
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewMoreClick = async function () { 
    const nextPage = pageNumber.current + 1; //render the next page and not the previous results
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage); //await expressions are only allowed with async functions
      setRecipes([...recipes, ...nextRecipes.results]);
      pageNumber.current = nextPage;
    } catch (error) {
      console.log(error);
    }
  };

  const addFavoriteRecipe = async function(recipe : Recipe) {
    try {
      await api.addFavoriteRecipe(recipe);
      setFavoriteRecipes([...favoriteRecipes, recipe])
    } catch (error) {
      console.log(error);
    }
  }

  const removeFavoriteRecipe = async function(recipe : Recipe) {
    try {
      await api.removeFavRecipe(recipe);
      const updatedRecipes = favoriteRecipes.filter((favRecipe) => recipe.id !== favRecipe.id); //remove recipe that is not in the array
      setFavoriteRecipes(updatedRecipes);           
    } catch (error) {
      console.log(error)
    }
  }

  //When an event gets submitted it passes that event to the function
  return ( 
    <div className='appContainer'>
      <div className='header'>
        <img className="headerImage" src="/foodImage.jpg"></img> {/**to get images, go to https://www.pexels.com/ */}
        <div className='title'>Recipe Finder</div>
        <div className='sub-title'>Find a delicious recipe!</div>
      </div>
      <div className='tabs'>
        <h1 className={selectedTab === "search" ? "tab-active" : ""} onClick={() => setSelectedTab("search")}>Recipe Search</h1>
        <h1 className={selectedTab === "favorites" ? "tab-active" : ""}  onClick={() => setSelectedTab("favorites")}>Favorites</h1>
      </div>
      {selectedTab === "search" && (
      <>
      <form onSubmit={(event) => handleSearchSubmit(event)}> 
        <input
          type = "text"
          required
          placeholder='Type a word to start looking recipes for. e.g., chicken, tacos...'

          //curly brackets for dynamic value
          value = {searchTerm} 
          onChange={function (event) {
            setSearchTerm(event.target.value)
          }}
          >
        </input>
        <button className= "submitBtn" type="submit"><AiOutlineSearch size = {30}/></button>
      </form>
      
      <div className='recipeGrid'>
      {recipes.map((recipe) => {
        //returs true if favorited recipe is included in the search response
        const isFavorite = favoriteRecipes.some( //some() if at least one element meets condition id == id
          (favRecipe) => recipe.id == favRecipe.id);
        
        if (recipes)
        return (
          <RecipeCard
            recipe={recipe}
            onClick={() => setSelectedRecipe(recipe)}

            //if heart is clicked it will remove recipe 
            onFavoriteBtnClick={isFavorite ? removeFavoriteRecipe : addFavoriteRecipe} 
            isFavorite={isFavorite} />
        );
      })}
      </div>

      <button className = 'viewMoreBtn' onClick={handleViewMoreClick}>View More</button>

      </>
      )}
      
      {selectedTab === "favorites" && (
      <div className='recipeGrid'>
        {favoriteRecipes.map((recipe) => (
          <RecipeCard recipe = {recipe} 
          onClick={()=> setSelectedRecipe(recipe)}
          onFavoriteBtnClick={removeFavoriteRecipe}
          isFavorite={true} //always red if on favorite tab
          />
        ))}
      </div>
      )}
      
      {selectedRecipe ? <RecipeModal recipeId={selectedRecipe.id.toString()} 
      onClose={()=> setSelectedRecipe(undefined)}/> : null}  
    </div>
  );
};

export default App;

/* 
{selectedRecipe ? <RecipeModal/> : null} 
if selectedRecipe is true then render RecipeModal
if false, then null
*/