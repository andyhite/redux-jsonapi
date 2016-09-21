import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deserialize } from 'redux-jsonapi';
import { fetchArticles } from '../modules/app';

function mapStateToProps(state) {
  const { api, app } = state;

  return {
    articles: app.articleIds.map((id) => deserialize(api.articles[id], api)),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchArticles: () => dispatch(fetchArticles()),
  };
}

class App extends Component {
  componentDidMount() {
    this.props.fetchArticles();
  }

  render() {
    const { articles } = this.props;

    return (
      <div>
        <h1>Articles</h1>

        <ul>
          {articles.map((article, i) => (
            <li key={i}>
              <strong>{article.title}</strong> by <em>{article.author().firstName} {article.author().lastName}</em><br />
              <ul>
                {article.comments().map((comment, ii) => (
                  <li key={ii}>
                    {comment.body}<br />
                    - {comment.author().firstName} {comment.author().lastName}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
