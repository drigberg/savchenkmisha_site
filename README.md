# savchenkmisha_site
personal website for a dear friend, codename Doctor Bear.

## Credentials
Default credentials are generated at startup and logged by the server. They can be changed at any time through the UI or API, as detailed below.

## UI
Login with admin credentials to manage projects.

Admin abilities:
- update profile photo (to do)
- update resume (to do)
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