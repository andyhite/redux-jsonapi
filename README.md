# Redux JSON:API

[![Travis CI](https://travis-ci.org/andyhite/redux-jsonapi.svg)](https://travis-ci.org/andyhite/redux-jsonapi)
[![Code Climate](https://codeclimate.com/github/andyhite/redux-jsonapi/badges/gpa.svg)](https://codeclimate.com/github/andyhite/redux-jsonapi)
[![Test Coverage](https://codeclimate.com/github/andyhite/redux-jsonapi/badges/coverage.svg)](https://codeclimate.com/github/andyhite/redux-jsonapi/coverage)

Redux JSON:API is a collection of actions and reducers for Redux that help ease the use of a [JSON:API](http://jsonapi.org/) compliant API.

JSON:API is amazing for data transport, but once a client has the data it can be a little frustrating to work with. Redux JSON:API takes the guess-work and bike-shedding about how to structure, store, and use your JSON:API data in a Redux application.

## Instalation

To install the stable version:

```
npm install --save redux-jsonapi
```

## Usage

### The Basics

The following will fetch a widget from `GET http://example.com/widgets/1`, add it to the application state under `api` (indexed by it's ID), and output the new state to the console.

```js
import { createStore, combineReducers } from 'redux';
import { apiReducer, apiActions, createApiMiddleware } from 'redux-jsonapi';

const reducers = combineReducers({
  api: apiReducer
})

const apiMiddleware = createApiMiddleware('http://example.com');

const store = createStore(reducers, applyMiddleware(apiMiddleware);

store.subscribe(() => {
  console.log(store.getState().api);
});

store.dispatch(apiActions.read({
  id: 1,
  type: 'widgets',
}));
```

Creating a widget via the API and adding it to the application state on success isn't much more complicated:

```js
store.dispatch(apiActions.write({
  type: 'widgets',
  attributes: {
    name: 'Super Cool Widget',
  },
}));
```

Updating an existing record is nearly identical - simply make sure the resource has an ID property:

```js
store.dispatch(apiActions.write({
  id: 1,
  type: 'widgets',
  attributes: {
    name: 'Super Cool Widget With A New Name',
  },
}));
```

Deleting a record is very similar:

```js
store.dispatch(apiActions.remove({
  id: 1,
  type: 'widgets',
}));
```

### Using Data

Data received from the JSON:API store is normalized into categories by resource type, and indexed by the resource's ID. The structure looks something like the following:

```js
{
  api: {
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
```

Since often the data that we receive from the API contains associations to other resources, this isn't a very easy structure to work with out of the box. Redux JSON:API contains utilities that make serializing and deserializing resources between the JSON:API structure and a vanilla Javascript object structure much easier.

The following will fetch a widget from the API at /widgets/1, and upon being loaded into the Redux state it will log a *deserialized* instance of it to the console.

```js
import { apiActions, deserialize } from 'redux-jsonapi';

store.subscribe(() => {
  const { api } = store.getState();
  const widget = deserialize(api.widgets[1], api);
  console.log(widget);
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

When it comes time to update the widget, simply change it's values and dispatch the `apiActions.write` action with the object.

```js
widget.name = 'New Name';
widget.doodad = () => newDoodad;
store.dispatch(apiActions.write(widget));
```

## Example

See the [example](https://github.com/andyhite/redux-jsonapi/tree/master/example) directory.

## License

MIT
