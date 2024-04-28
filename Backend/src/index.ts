//This is our backend source connection to the website;

//(3) express framework to build routes and handklers to interact with APIs
import express from "express"; 

//(4) middleware
import cors from "cors"; 
import {PrismaClient} from '@prisma/client';
import "dotenv/config";
import * as RecipeAPI from "./recipe-api";

const app = express();
const prismaClient = new PrismaClient();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000

//http://localhost:5000/api/recipes/search
app.get("/api/recipes/search", async (req, res) => { //request(req) is info about what the client is requesting and response(res) is the info sent to client from API
  const searchTerm = req.query.searchTerm as string;
  const page = parseInt(req.query.page as string); 

  const results = await RecipeAPI.searchRecipes(searchTerm, page);
  return res.json(results);

});

app.get("/api/recipes/:recipeId/summary", async(req, res) =>{  //: in recipeId denote a placeholder

  //Express.js- route parameters with ':' in the route pattern, :recipeId, are accessed via req.params, not req.query.,
  const recipeId = req.params.recipeId; 
  
  const results = await RecipeAPI.getRecipeSummary(recipeId);
  return res.json(results);
});0

app.post("/api/recipes/favourite", async(req, res) => {
  const recipeId = req.body.recipeId;
  try {
    const favouriteRecipe = await prismaClient.favoriteRecipes.create({
      data: {
        recipeId : recipeId,
      },
    });
    return res.status(201).json(favouriteRecipe); //201 -> success;
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: "Something went wrong"}); //500 -> failure;
  }
})

app.get("/api/recipes/favourite", async(req, res) =>{
  try {
    const recipes = await prismaClient.favoriteRecipes.findMany();
    const recipeIds = recipes.map((recipe) => recipe.recipeId.toString()) //creates array of ids.
    const results = await RecipeAPI.getFavoriteRecipesByIds(recipeIds);

    return res.json(results);

  } catch (error) {
    return res.status(500).json({error: "Something went wrong"}); //500 -> failure;
  }
})

app.delete("/api/recipes/favourite", async(req, res) =>{
  const recipeId = req.body.recipeId;
  try {
    const recipe = await prismaClient.favoriteRecipes.delete({where: {recipeId : recipeId}});
    return res.status(204).send(); // 204 -> new content/something was deleted.
  } catch (error) {
    return res.status(500).json({error: "Something went wrong"}); //500 -> failure;
  }
})

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

/**
 * The index.ts file, being the entry point of your application, typically contains the main logic of your application. This includes 
 * setting up routes, defining middleware, connecting to databases, initializing services, and any other essential code required to run 
 * your application.
 */