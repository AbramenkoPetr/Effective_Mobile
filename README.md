Открыть терминал в корневой папке проекта

установить зависимости
npm i
В командной сроке npm start
Тестирование доступно в браузере http://localhost:8080

api

POST    http://localhost:8080/api/users     регистрация пользователя
body
{
    "name": "Петров Иван Иванович",
    "date_of_birth": "1959-02-22",
    "email": "mail1315@mail.ru",
    "password": "1315",
    "role": "admin"
} 


POST    http://localhost:8080/api/users/auth     авторизация пользователя
body
{
    "email": "mail1315@mail.ru",
    "password": "1312"
}
результат - token

GET     http://localhost:8080/api/users/one?id=7     Получение пользователя по ID
headers: {  'x-auth': token }

GET     http://localhost:8080/api/users/blocking?id=1   Блокировка пользователя
headers: {  'x-auth': token }

GET     http://localhost:8080/api/users     Получение списка пользователей
headers: {  'x-auth': token }