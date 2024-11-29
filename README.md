https://springfinalito.onrender.com/
## Dependencias

Este proyecto usa las siguientes dependencias:

- `express`: Framework web para Node.js.
- `mongoose`: ORM para MongoDB.
- `ejs`: Motor de plantillas para generar HTML.
- `express-ejs-layouts`: Para usar layouts con EJS.


5. Ejecuta la aplicación:

    ```bash
    npm start
    ```

6. Accede a la aplicación en tu navegador en `http://localhost:3000/superheroes`.

## Rutas Disponibles

- `GET /`: Página principal.
- `GET /superheroes`: Muestra todos los superhéroes.
- `GET /superheroes/editar/:id`: Editar un superhéroe existente.
- `POST /superheroes`: Crear un nuevo superhéroe.
- `POST /delete-hero/:id`: Eliminar un superhéroe.



## Licencia

Este proyecto está licenciado bajo la MIT License - consulta el archivo [LICENSE](LICENSE) para más detalles.
