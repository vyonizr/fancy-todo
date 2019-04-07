# fancy-todo

## Routes

### Users Routes

| Route | Method | Header(s) | Body | Description |
| ----- | ------ | --------- | ---- | ----------- |
| `/users` | GET | `Authentication:token` | - | Gets all users |
| `/users/login` | POST | - | `email:String`,`password:String` | Log in |
| `/users/register` | POST | - | `email:String`,`name:String`,`password:String` | Register a user |
| `/users/google-sign-in` | POST | - | `idToken:String` | Log in by google |

### Todos Routes

| Route | Method | Header(s) | Body | Params | Query | Description |
| ----- | ------ | --------- | ---- | ------ | ----- | ----------- |
| `/todos` | GET | `Authentication:token` | - | - | `token` | Gets all todos |
| `/todos/done` | GET | `Authentication:token` | - | - | `token` | Get completed todos |
| `/todos/:userId/create` | POST | `Authentication:token` | `name:String`, `dueDate:Date`, `description:String` | `userId` | - | Create a todo |
| `/todos/:todoId` | PATCH | `Authentication:token` | `name:String`, `dueDate:Date`, `description:String` | `todoId` | - | Update details on a todo |
| `/todos/:todoId/done` | PATCH | `Authentication:token` | - | `todoId` | - | Mark a todo as done |
| `/todos/:todoId` | DELETE | `Authentication:token` | - | `todoId` | - | Delete a todo |
| `/todos/:userId` | GET | `Authentication:token` | - | `userId` | - | Get a user's todos |

## Usage

It is recommended to have [nodemon](https://nodemon.io/) installed globally before you begin.

1. Setup your MongoDB database name on `app.js` inside `server` folder
2. create file named `.env` and set it up based on `.env.example`
3. Open a terminal. Launch your MongoDB server.
4. Open a terminal. Get inside `server` directory. Run `npm install` to install dependencies and then run `npm run dev`.

You're all set if you are only running with API testing app like [Postman](https://www.getpostman.com/). If you want to run the client side as well, install [live-server](https://www.npmjs.com/package/live-server). Global install is recommended.

5. Open a terminal. Get inside `client` directory. Run `live-server --host=localhost`