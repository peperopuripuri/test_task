### Описание  
В этом задании вам необходимо создать cli-приложение, которое будет скачивать веб-страницу и все ресурсы на ней (картинки, стили и js) давая возможность открывать страницу без интернета.  

## Пример использования:  

``page-loader --output /var/tmp https://ru.hexlet.io/courses

`✔ https://ru.hexlet.io/lessons.rss`
✔ https://ru.hexlet.io/assets/application.css
✔ https://ru.hexlet.io/assets/favicon.ico
✔ https://ru.hexlet.io/assets/favicon-196x196.png
✔ https://ru.hexlet.io/assets/favicon-96x96.png
✔ https://ru.hexlet.io/assets/favicon-32x32.png
✔ https://ru.hexlet.io/assets/favicon-16x16.png
✔ https://ru.hexlet.io/assets/favicon-128.png

Page was downloaded as 'ru-hexlet-io-courses.html'``

### Установка:
- git clone/download zip.
- npm ci
- Помощь: ``node src/cli.js page-loader -h``
- Пример запуска программы (дефолтная директория): ``node src/cli.js page-loader https://ru.hexlet.io/courses``
- Пример запуска программы: ``node src/cli.js page-loader https://ru.hexlet.io/courses -o exampleDir``
- тесты: ``npx jest``
- линтер (все файлы): ``npx eslint .``
