# savchenkmisha_site
personal website for a dear friend, codename Doctor Bear.

## Credentials
Default credentials are generated at startup and logged by the server. They can be changed at any time through the UI or API, as detailed below.

## Setup
When starting the server, check for default credentials in the console output.
```
npm run seed-db
npm run start:dev
```

## UI

The UI acts as a template for all the data. It shows:
  - banner info
  - the first three enabled projects it gets from the API
  - resume download link
  - contact info

## Admin
Login with admin credentials to manage projects.

Login route: /login
Admin page: /admin

Admin abilities:
- update contact info
- upload resume
- change username
- change password
- create project
- update project
- disable project
- delete project

## API
Project structure:

```js
{
  id: <string>,
  title: <string>,
  description: <string>,
  images: <url>[],
  disabled: <boolean>
}
```

### POST /change_password
Request:
```js
{
  username: <string>,
  new_password: <string>
}
```

On success, will redirect to homepage, logged out.
On failure, will send statusCode 500.

### POST /change_username
Request:
```js
{
  new_username: <string>,
  password: <string>
}
```

On success, will redirect to homepage, logged out.
On failure, will send statusCode 500.

### POST /login
- logs in user

Request:
```js
{
  username: <string>,
  password: <string>
}
```

Redirects to '/' on success, or '/login' on failure.

### GET /projects
- lists all projects

Response:

```js
[<project>, <project>]
```

### POST /projects
- creates new project

Request:

```js
{
  title: <string>, **optional**
  description: <string>, **optional**
  images: <url>[], **optional (default: [])**,
  disabled: <boolean> **optional (default: false)**
}
```

Response: (newly created project, with generated id)

### POST /projects/:id
- updates project
- can update any parameter except id

### DELETE /projects/:id
- removes project

response:
```json
{
  "ok": "ok"
}
```