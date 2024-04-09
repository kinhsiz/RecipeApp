//import "dotenv/config" in index.ts;
const apiKey = process.env.API_KEY; 

export const searchRecipes = async (searchTerm: string, page: number) => {
    if (!apiKey) {
      throw new Error("API key not found"); 
    }
    
    //endpoint a client can request to interact with a web server
    const baseURL = new URL("https://api.spoonacular.com/recipes/complexSearch"); 
    
    const queryParams = {
      apiKey,
      query: searchTerm,
      number: "10", //Nuumber of recipes per request;
      offset: (page * 10).toString(), 
    };

   //href: 'https://api.spoonacular.com/recipes/complexSearch?apiKey=########################&query=burgers&number=10&offset=10'
    baseURL.search = new URLSearchParams(queryParams).toString(); //construct query parameters for a new URL
  
    try {
      const searchResponse = await fetch(baseURL);
      const resultsJson = await searchResponse.json();
      return resultsJson; //information return from the SpoonacularAPI
    } catch (error) {
      console.error(error);
    }
  };

  export const getRecipeSummary = async (recipeId: string) =>{
    if (!apiKey) {
      throw new Error("API key not found");
  }

    const baseURL = new URL(`https://api.spoonacular.com/recipes/${recipeId}/summary`);
    const queryParams = {apiKey}

    baseURL.search = new URLSearchParams(queryParams).toString();
    try {
      const searchResponse = await fetch(baseURL);
      const resultsJson = await searchResponse.json();
      return resultsJson;
    } catch (error) {
      console.log(error);
    }
}


  export const getFavoriteRecipesByIds = async(ids: string[]) => {
    if (!apiKey) {
      throw new Error("API key not found");
  }
    const baseURL = new URL("https://api.spoonacular.com/recipes/informationBulk")
    const queryParams = {
      apiKey, 
      ids : ids.join(","),
    }
    //https://api.spoonacular.com/recipes/informationBulk?ids=715538,716429
    baseURL.search = new URLSearchParams(queryParams).toString();

    try {
      const searchResponse = await fetch(baseURL);
      const resultsJson = await searchResponse.json();

      return {results: resultsJson};
    } catch (error) {
      console.log(error);
    }
}

  //Async is used to define an asynchronous function. It indicates that the function will operate asynchronously 
  //and may use the await keyword to pause execution and wait for promises to resolve.
  /*
   asynchronous functions in do not block the execution of subsequent code. Instead, they allow 
   other code to run while waiting for asynchronous operations to complete. Asynchronous functions are commonly used for tasks 
   that involve waiting for external resources, such as fetching data from an API or 
   reading from a file, as well as for operations that could potentially take a long time to complete, such as 
   computations or heavy processing. They use asyn and await
  */