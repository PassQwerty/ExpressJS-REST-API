// Запуск
// node server.js

// для автообновления сервера установлен nodemon
// npx nodemon server.js

const express = require("express");
const app = express();
const port = 3000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

const data = {
  status: HTTP_STATUSES.OK_200,
  persons: [
    {
      id: 0,
      name: "Иван",
      age: 18,
      city: "Анапа",
    },
    {
      id: 1,
      name: "Эрик",
      age: 18,
      city: "Анапа",
    },
    {
      id: 2,
      name: "Василий",
      age: 28,
      city: "Новороссийск",
    },
    {
      id: 3,
      name: "Эльдар",
      age: 23,
      city: "Краснодар",
    },
  ],
};

app.get("/", (req, res) => {
  res.status(HTTP_STATUSES.OK_200);
  res.send("<h1>Welcome to Home page</h1>");
});

app.get("/data", (req, res) => {
  /*
  fetch("http://localhost:3000/data", { method: "GET" })
    .then((response) => response.json())
    .then((json) => console.log(json));
  */
  res.status(HTTP_STATUSES.OK_200);
  res.json(data);
});

app.get("/data/person", (req, res) => {
  // http://localhost:3000/data/person?age=18
  const age = Number(req.query.age);
  const searchPerson = data.persons.filter((person) => person.age === age);
  if (searchPerson.length === 0) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.status(HTTP_STATUSES.OK_200);
  res.json(searchPerson);
});

app.get("/data/person/:id", (req, res) => {
  // http://localhost:3000/data/person/1
  const id = Number(req.params.id);
  const searchPerson = data.persons.find((person) => person.id === id);
  if (searchPerson === undefined) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.status(HTTP_STATUSES.OK_200);
  res.json(searchPerson);
});

app.post("/data/person", function (req, res) {
  /*
  fetch("http://localhost:3000/data/person", {
    method: "POST",
    body: JSON.stringify({ name: "Фуууу" }),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
  */
  const newName = req.body.name;

  if (req.body.name.length === 0) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const lengthPersonIndex = data.persons.length - 1;
  const lastPerson = data.persons[lengthPersonIndex];
  const lastPersonId = Number(lastPerson.id);

  const newPerson = {
    id: lastPersonId + 1,
    name: newName,
    age: 18,
    city: "unknown",
  };

  data.persons.push(newPerson);
  res.status(HTTP_STATUSES.CREATED_201);
  res.json(newPerson);
});

app.delete("/data/person/:id", (req, res) => {
  /*
  fetch("http://localhost:3000/data/person/2",{method: "DELETE"})
    .then((response) => response.json())
    .then((json) => console.log(json));
  */
  const id = Number(req.params.id);
  if (id < 0 || id > data.persons.length - 1) {
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  }
  data.persons = data.persons.filter((person) => person.id !== id);
  res.status(HTTP_STATUSES.OK_200);
  res.send(data);
});

app.put("/data/person/:id", (req, res) => {
  /*
  fetch("http://localhost:3000/data/person/3", {
    method: "PUT",
    body: JSON.stringify({ name: "Джарахов" }),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
  */
  const id = Number(req.params.id);
  if (id < 0 || id > data.persons.length - 1) {
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
  }

  const newName = req.body.name;
  if (newName.length === 0) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const searchPerson = data.persons.find((person) => person.id === id);

  if (searchPerson === undefined) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  searchPerson.name = newName;
  res.status(HTTP_STATUSES.OK_200);
  res.json(searchPerson);
});

app.listen(port, () => {
  console.log(`Example app listening http://localhost:${port}`);
});
