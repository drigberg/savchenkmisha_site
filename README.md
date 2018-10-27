# savchenkmisha_site
personal website for a dear friend

## UI
Login with admin credentials to manage projects.

Admin abilities:
- update profile photo (to do)
- update resume (to do)
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