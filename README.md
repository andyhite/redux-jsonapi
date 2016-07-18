# Redux JSON:API

Redux JSON:API is a collection of actions and reducers for Redux that help ease the use of a [JSON:API](http://jsonapi.org/) compliant API.

JSON:API is amazing for data transport, but once a client has the data it can be a little frustrating to work with. Redux JSON:API takes the guess-work and bike-shedding about how to structure, store, and use your JSON:API data in a Redux application.

### Instalation

To install the stable version:

```
npm install --save redux-jsonapi
```

### The Basics

The following will fetch a widget from `http://example.com/widgets/1`, add it to the Redux store under the `api` store indexed by it's ID, and output the new state of the `api` store to the console.

```js
window.API_HOST = 'http://example.com';

import { createStore, combineReducers } from 'redux';
import { apiReducer, apiActions } from 'redux-jsonapi';

const reducers = combineReducers({
  api: apiReducer
})

const store = createStore(reducers);

store.subscribe(() => {
  console.log(store.getState().api);
});

store.dispatch(apiActions.read({
  id: 1,
  type: 'widgets',
}));
```

Creating a widget via the API and adding it to the `api` store on success isn't much more complicated:

```js
store.dispatch(apiActions.create({
  type: 'widgets',
  attributes: {
    name: 'Super Cool Widget',
  },
}));
```

Updating an existing record is also very similar:

```js
store.dispatch(apiActions.update({
  id: 1,
  type: 'widgets',
  attributes: {
    name: 'Super Cool Widget With A New Name',
  },
}));
```

As is deleting a record:

```js
store.dispatch(apiActions.destroy({
  id: 1,
  type: 'widgets',
}));
```

### Using Data

Data received from the JSON:API store is normalized into categories by resource type, and indexed by the resource's ID. The structure looks something like the following:

```js
{
  api: {
    resources: {
      widgets: {
        1: {
          id: 1,
          type: 'widgets',
          attributes: {
            name: 'Super Cool Widget',
          },
          relationships: {
            doodad: {
              data: {
                id: 1,
                type: 'doodads',
              }
            }
          }
        },
        2: { ... },
      },
      doodads: {
        1: {
          id: 1,
          type: 'doodads',
          attributes: {
            name: 'Nifty Doodad',
          },
        },
        2: { ... },
      }
    }
  }
}
```

Since often the data that we receive from the API contains associations to other resources, this isn't a very easy structure to work with out of the box. Redux JSON:API contains utilities that make serializing and deserializing resources between the JSON:API structure and a vanilla, fully-linked Javascript object structure much easier.

The following will fetch a widget from the API at /widgets/1, and upon being loaded into the Redux state it will log a *denormalized* instance of it to the console.

```js
import { api, apiActions } from 'redux-jsonapi';

store.subscribe(() => {
  const resource = api.getResource('widgets', 1, store.getState().api);
  console.log(resource);
});

store.dispatch(apiActions.read({
  id: 1,
  type: 'widgets',
}));
```

The denormalized instance looks something like this:

```js
const widget = {
  id: 1,
  name: 'Super Cool Widget',
  doodad: function() { // Calling this returns the associated doodad }
}
```

With this new denormalized resource, we can access the widget's name via `widget.name`, and it's associated doodad by calling `widget.doodad()`.

When it comes time to update the widget, simply change it's values and dispatch the `apiActions.update` action with the object.

```js
widget.name = 'New Name';
store.dispatch(apiActions.update(widget));
```

### License

MIT
