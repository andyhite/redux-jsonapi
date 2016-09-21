import { apiActions } from 'redux-jsonapi';

export const FETCH_ARTICLES = '@@example/app/FETCH_ARTICLES';

function getDefaultState() {
  return {
    articleIds: [],
  };
};

export function fetchArticles() {
  return (dispatch) => {
    return dispatch(apiActions.read({ _type: 'articles' })).then((data) => {
      dispatch({ type: FETCH_ARTICLES, payload: { articleIds: data.result }});
    });
  };
}

export default function reducer(state = getDefaultState(), { type, payload }) {
  switch(type) {
    case FETCH_ARTICLES:
      return { ...state, articleIds: payload.articleIds };
    default:
      return state;
  }
}
