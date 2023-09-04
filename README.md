### Описание  
В этом задании вам необходимо создать cli-приложение, которое будет скачивать веб-страницу и все ресурсы на ней (картинки, стили и js) давая возможность открывать страницу без интернета.  

### Установка:
- git clone/download zip.
- `npm ci`
- Помощь: `node src/cli.js page-loader -h`
- Пример запуска программы (дефолтная директория): `node src/cli.js page-loader https://ru.hexlet.io/courses`
- Пример запуска программы: `node src/cli.js page-loader https://ru.hexlet.io/courses -o exampleDir`
- тесты: `npx jest`
- линтер (все файлы): `npx eslint .`
