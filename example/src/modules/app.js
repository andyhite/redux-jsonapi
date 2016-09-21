import { apiActions } from 'redux-jsonapi';

export const FETCH_ARTICLES = '@@example/app/FETCH_ARTICLES';

function getDefaultState() {
  return {
    articleIds: [],
  };
};

export function fetchArticles() {
  return async (dispatch) => {
    const data = await dispatch(apiActions.read({ _type: 'articles' }, {
      params: {
        include: ['author', 'comments', 'author.comments'].join(','),
      },
    }));

    dispatch({ type: FETCH_ARTICLES, payload: { articleIds: data.result }});

    return data;
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
