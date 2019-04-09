# fancy-todo: Apostly

## Usage

It is recommended to have [nodemon](https://nodemon.io/) installed globally before you begin.

1. Setup your MongoDB database name on `app.js` inside `server` folder
2. Create a file named `.env` and set it up based on `.env.example` (Read [dotenv documentation](dotenv) for details)
3. Open a terminal. Launch your MongoDB server by running `mongod`. If it fails, try it again with `sudo` prefix (Linux).
4. Open a terminal. Get inside `server` directory. Run `npm install` to install dependencies and then run `npm run dev`.

You're all set, if you are only using the API with API testing app like [Postman](https://www.getpostman.com/). If you want to run the client side as well, install [live-server](https://www.npmjs.com/package/live-server). Global install is recommended. The next step is:

5. Open a terminal. Get inside `client` directory. Run `live-server --host=localhost`

**Additional note**:

If you use Firefox, the `due date` form when creating a new task shows a blank field, because the browser [does not support](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Browser_compatibility)
 `datetime-local` input type. It is better to be viewed in Google Chrome.

## Routes

### Users Routes

| Route | Method | Header(s) | Body | Description | Response |
| ----- | ------ | --------- | ---- | ----------- | -------- |
| `/users` | GET | `Authentication:token` | - | Get all users | Success<br />Code: 200<br/>body: [{object user}, {object user}, ... ]<br /><br />Error:<br />(500)<br />body: {object error} |
| `/users/login` | POST | - | `email:String` (**required**),`password:String` (**required**) | Log in and obtain a `JSON Web Token` | Success<br />Code: 200<br/>body: [{object user}, {object user}, ... ]<br /><br />Error (wrong email/password):<br />(401)<br />body: {object error}<br /><br />Error (email not found):<br />(404)<br />body: {object error}<br /><br />Error:<br />(500)<br />body: {object error} |
| `/users/register` | POST | - | `email:String` (**required**),`name:String` (**required**),`password:String` (**required**) | Register a user | Success<br />Code: 201<br/>body: {token:String}<br /><br />Error (blank required field(s)):<br />(400)<br />body: {object error}<br /><br />Error:<br />(500)<br />body: {object error} |
| `/users/google-sign-in` | POST | - | `idToken:String` | Log in by google and obtain a `JSON Web Token` | Success<br />Code: 200<br/>body: {token:String, id:String, name:String}<br /><br />Error:<br />(500)<br />body: {object error} |

### Todos Routes

| Route | Method | Header(s) | Body | Params | Query | Description | Response |
| ----- | ------ | --------- | ---- | ------ | ----- | ----------- | -------- |
| `/todos` | GET | `Authentication:token` | - | - | - | Get all your todos | Success<br />Code: 200<br/>body: [{object todo}, {object todo}, ... ]<br /><br />Error (unauthenticated):<br />(401)<br />body: { message: "You are not authenticated. Please login." }<br /><br />Error:<br />(500)<br />body: {object error} |
| `/todos/done` | GET | `Authentication:token` | - | - | - | Get your completed todos | Success<br />Code: 200<br/>body: [{object todo}, {object todo}, ... ]<br /><br />Error (unauthenticated):<br />(401)<br />body: { message: "You are not authenticated. Please login." }<br /><br />Error:<br />(500)<br />body: {object error} |
| `/todos/:userId/create` | POST | `Authentication:token` | `name:String` (**required**), `dueDate:Date` (**required**), `description:String` (**required**) | `userId` | - | Create a todo | Success<br />Code: 201<br/>body: {object user (you)}<br /><br />Error (blank required field(s)):<br />(400)<br />body: {object error}<br /><br />Error (unauthenticated):<br />(401)<br />body: { message: "You are not authenticated. Please login." }<br /><br />Error:<br />(500)<br />body: {object error} |
| `/todos/:todoId` | PATCH | `Authentication:token`, `Authorization:todo's owner ID` | `name:String` (**required**), `dueDate:Date` (**required**), `description:String` (**required**) | `todoId` | - | Update details on a todo | Success<br />Code: 200<br/>body: { object updated todo }<br /><br />Error (unauthenticated):<br />(401)<br />body: { message: "You are not authenticated. Please login."<br /><br />Error (unauthorized):<br />(401)<br />body: { message: "You are not authorized to perform this action." }<br /><br />Error:<br />(500)<br />body: {object error} |
| `/todos/:todoId/done` | PATCH | `Authentication:token`, `Authorization:todo's owner ID` | - | `todoId` | - | Mark a todo as done | Success<br />Code: 200<br/>body: { object updated todo }<br /><br />Error (unauthenticated):<br />(401)<br />body: { message: "You are not authenticated. Please login." }<br /><br />Error (unauthorized):<br />(401)<br />body: { message: "You are not authorized to perform this action." }<br /><br />Error:<br />(500)<br />body: {object error} |
| `/todos/:todoId/outstanding` | PATCH | `Authentication:token`, `Authorization:todo's owner ID` | - | `todoId` | - | Mark a todo as outstanding | Success<br />Code: 200<br/>body: { object updated todo }<br /><br />Error (unauthenticated):<br />(401)<br />body: { message: "You are not authenticated. Please login." }<br /><br />Error (unauthorized):<br />(401)<br />body: { message: "You are not authorized to perform this action." }<br /><br />Error:<br />(500)<br />body: {object error} |
| `/todos/:todoId` | DELETE | `Authentication:token`, `Authorization:todo's owner ID` | - | `todoId` | - | Delete a todo | Success<br />Code: 200<br/>body: { message: "delete success" }<br /><br />Error (unauthenticated):<br />(401)<br />body: { message: "You are not authenticated. Please login." }<br /><br />Error (unauthorized):<br />(401)<br />body: { message: "You are not authorized to perform this action." }<br /><br />Error:<br />(500)<br />body: {object error} |
| `/todos/:userId` | GET | `Authentication:token` | - | `userId` | - | Get a user's todos | Success<br />Code: 200<br/>body: [{object todo}, {object todo}, ... ]<br /><br />Error (unauthenticated):<br />(401)<br />body: { message: "You are not authenticated. Please login." }<br /><br />Error:<br />(500)<br />body: {object error} |
