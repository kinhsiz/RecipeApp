import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Recipe } from "../types"

//ts/ interface properties for common structures
interface Props { 
    recipe : Recipe;
    isFavorite: boolean;
    onClick: () => void;
    onFavoriteBtnClick: (recipe : Recipe) => void;
}

const RecipeCard = function({recipe, onClick, onFavoriteBtnClick, isFavorite} : Props){
    return (
        <div className = 'recipeCard' onClick={onClick}>
            <img src = {recipe.image}></img>
            <div className = 'recipeCardTitle'>
                <h3>{recipe.title}</h3>
                {/*stopPropogation -- ignore onClick on 'recipeCard' class and fire this onClick logic*/}
                <span onClick={(event) =>{
                    event.stopPropagation()
                    onFavoriteBtnClick(recipe)
                }}>
                    {isFavorite ? <AiFillHeart size={20} color="red"/> : <AiOutlineHeart size={20}/>}
                </span>
            </div>
        </div>
    )
}

export default RecipeCard;