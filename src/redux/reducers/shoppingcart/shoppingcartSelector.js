import { createSelector } from 'reselect';

// Obtiene un array de las categorías existentes de la lista de artículos
export const getCategories = () =>
  createSelector(
    (state) => state.articles.articles,
    (articles) => {
      const categories = [];
      if (articles) Object.values(articles).forEach(article => {
          if (!categories.includes(article["category"])) 
            categories.push(article["category"]);
      });
      return categories;
    }
  );

// Obtiene un artículo específico por id
export const getArticle = (id) =>
  createSelector(
    (state) => state.articles.articles,
    (items) => {
      try {
        const article = items.find((item) => item.id == id);
        return article != undefined ? new Article(article) : article
      } catch(e) { return undefined }
    }
  );

// Obtiene un array de los artículos seleccionados
export const getSelectedArticles = () =>
  createSelector(
    (state) => state.articles.articles,
    (articles) => {
      const selectedArticles = [];
      if (articles) {
        if (articles.length > 0) {
          Object.values(articles).forEach(article => {
            if (article.amountSelected > 0)
              selectedArticles.push(new Article(article));
          })
        }
        return selectedArticles;
      }
    }
  );

// Obtiene un int con la cantidad total de articulos seleccionados
export const getSelectedArticlesAmount = () =>
  createSelector(
    (state) => state.articles.articles,
    (articles) => {
      let amount = 0;
      if (articles) Object.values(articles).forEach(article => {
        if (article.amountSelected > 0) 
          amount += article.amountSelected;
      });
      return amount;
    }
  );

// Obtiene un JSON con los artículos separados según su categoría
export const getArticlesByCategory = (category=undefined) => 
  createSelector(
    (state) => state.articles.articles,
    (articles) => {
      let categoryList = {};
      Object.values(articles).forEach(article => {
        if (category == undefined || article["category"] == category) {
          const key = categoryList[article["category"]];
          if (key === undefined) categoryList[article["category"]] = [new Article(article)];
          else categoryList[article["category"]].push(new Article(article));
        }
      });
      return categoryList;
    }
  );