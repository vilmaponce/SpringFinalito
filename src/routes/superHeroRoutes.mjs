import express from 'express';
import {
  obtenerSuperheroePorIdController,
  obtenerTodosLosSuperheroesController,
  buscarSuperheroesPorAtributoController,
  obtenerSuperheroesMayoresDe30YConFiltrosController,
  crearSuperheroeController,
  actualizarSuperheroeController,
  mostrarFormularioDeEdicion,
  eliminarSuperheroeController
} from '../controllers/superheroesController.mjs';
import {
  crearSuperHeroeValidation,
  actualizarSuperHeroeValidation,
  eliminarSuperheroeValidation
} from '../validators/superHeroValidator.mjs';
import { validationHandler } from '../validators/validationHandler.mjs';

const router = express.Router();



/* Rutas para obtener información */
// Obtener todos los superhéroes
router.get('/heroes', obtenerTodosLosSuperheroesController);

// Obtener un superhéroe por ID
router.get('/heroes/:id', obtenerSuperheroePorIdController);

// Buscar superhéroes por un atributo específico
router.get('/heroes/buscar/:atributo/:valor', buscarSuperheroesPorAtributoController);

// Obtener superhéroes mayores de 30 años con filtros personalizados
router.get('/superheroes/filtros', obtenerSuperheroesMayoresDe30YConFiltrosController);

// Mostrar el formulario para editar un superhéroe
router.get('/superheroes/editar/:id', mostrarFormularioDeEdicion);


router.delete('/superheroes/:id', eliminarSuperheroeController);


/* Rutas para manejar datos (CRUD) */
// Crear un nuevo superhéroe con validación
router.post(
  '/superheroes',
  crearSuperHeroeValidation,
  validationHandler,
  crearSuperheroeController
);

// Actualizar un superhéroe por ID con validación
router.put(
  '/heroes/:id',
  actualizarSuperHeroeValidation,
  validationHandler,
  actualizarSuperheroeController
);

// Eliminar un superhéroe por ID con validación
router.delete(
  '/heroes/:id',
  eliminarSuperheroeValidation,
  validationHandler,
  eliminarSuperheroeController
);

export default router;
