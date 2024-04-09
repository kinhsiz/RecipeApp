import { useEffect, useState } from "react";
import { RecipeSummary } from "../types";
import { getRecipeSummary } from "../API";

interface Props {
    recipeId: string;
    onClose: () => void;
}

const RecipeModal = function({recipeId, onClose} : Props) {  //(1)
    const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>();

    useEffect(function() {
        const fetchRecipeSummary = async function() {
            try {
                const summaryRecipe = await getRecipeSummary(recipeId);
                setRecipeSummary(summaryRecipe);
            } catch (error) {
                console.log(error);
            }
        };
        fetchRecipeSummary();
    }, [recipeId]); // dependency array, useEffect logic changes when recipeId changes.

    if(!recipeSummary) {
        return <></>
    }

    return(
        <> 
        <div className="overlay"></div>
        <div className="modal">
            <div className="modalContent"> 
                <div className="modalHeader">
                 <h2>{recipeSummary?.title}</h2> 
                 <span className="closeBtn" onClick={onClose}>&times;</span>
                </div>
                <p dangerouslySetInnerHTML={{__html: recipeSummary.summary}}></p>
            </div>
        </div>
        </>
    )
};

export default RecipeModal;

/*
<h2>{recipeSummary?.id}</h2> 
? : to access properties of an object that can be undefined or null.
if id undefined it will return undefined isntead of throwing an error.
*/

/*
(1) Arguments should adhere to 'Props' interface, it should include a 'recipeId property of type string
*/