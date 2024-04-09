export interface Recipe {
    id: number;
    title: string;
    image: string;
    imageType: string;
  }

//properties obtained from API returned information -- http://localhost:5000/api/recipes/639413/summary
export interface RecipeSummary {
    id : number;
    title : string;
    summary : string
}