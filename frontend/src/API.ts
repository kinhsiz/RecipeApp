import { Recipe } from "./types";

//Builds the searching URL with the term to be searched and number
export const searchRecipes = async (searchTerm: string, page: number) => {
  const baseUrl = new URL("http://localhost:5000/api/recipes/search");
  baseUrl.searchParams.append("searchTerm", searchTerm);
  baseUrl.searchParams.append("page", String(page));

  const response = await fetch(baseUrl); //returns 'http://localhost:5000/api/recipes/search?searchTerm=burgers&page=1'
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

export const getRecipeSummary = async(recipeId: string) => {
  const baseUrl = new URL(`http://localhost:5000/api/recipes/${recipeId}/summary`); //ticks to replace recipeID, instead of quotes. 

  const response = await fetch(baseUrl);
  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export const addFavoriteRecipe = async(recipe : Recipe) => {
  const baseUrl = new URL("http://localhost:5000/api/recipes/favourite");
  const body = {recipeId : recipe.id};

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    }, 
    body: JSON.stringify(body) //convert body to string before passing to request
});
  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

export const getFavoriteRecipes = async() => {
  const baseUrl = new URL("http://localhost:5000/api/recipes/favourite");
  const response = await fetch(baseUrl);
  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export const removeFavRecipe = async(recipe : Recipe) => {
  const baseUrl = new URL("http://localhost:5000/api/recipes/favourite");
  const body = {recipeId : recipe.id};

  const response = await fetch(baseUrl, {
    method: "DELETE",
    headers: {
      "Content-Type" : "application/json"
    }, 
    body: JSON.stringify(body) //convert body to string before passing to request
});
  if(!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  if(response.status == 204) {
    return "Recipe successfully removed from favorites";
  } else {
    return response.json();
  }
  
}
