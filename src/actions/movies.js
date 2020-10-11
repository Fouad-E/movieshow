import actions from "./constants";

export function setIdRecipe(categoryMovies) {
  return {
    type: actions.SET_CATEGORY_CURRENT_MOVIES,
    id: categoryMovies,
  };
}
