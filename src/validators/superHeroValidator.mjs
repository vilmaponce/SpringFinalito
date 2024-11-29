import { body, param } from 'express-validator';

// Validación para crear un superhéroe
export const crearSuperHeroeValidation = [
    body('nombreSuperHeroe')
        .notEmpty().withMessage('El nombre del superhéroe es obligatorio')
        .isString().withMessage('El nombre del superhéroe debe ser una cadena de texto')
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('El nombre del superhéroe debe tener entre 3 y 60 caracteres'),

    body('nombreReal')
        .notEmpty().withMessage('El nombre real es obligatorio')
        .isString().withMessage('El nombre real debe ser una cadena de texto')
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('El nombre real debe tener entre 3 y 60 caracteres'),

    body('edad')
        .notEmpty().withMessage('La edad es obligatoria')
        .isInt({ min: 0 }).withMessage('La edad debe ser un número entero mayor o igual a 0')
        .toInt(),

    body('poderes')
        .notEmpty().withMessage('Los poderes son obligatorios')
        .isArray({ min: 1 }).withMessage('Debe proporcionar al menos un poder')
        .custom((poderes) => poderes.every(poder =>
            typeof poder === 'string' &&
            poder.trim().length >= 2 &&  // Cambio: longitud mínima de 2 caracteres
            poder.trim().length <= 60
        )).withMessage('Cada poder debe ser una cadena de texto sin espacios en blanco y tener entre 2 y 60 caracteres'),

    body('planetaOrigen')
        .notEmpty().withMessage('El planeta de origen es obligatorio'),

    body('debilidad')
        .notEmpty().withMessage('La debilidad es obligatoria'),

    body('aliados')
        .optional()
        .isArray().withMessage('Los aliados deben ser un arreglo')
        .custom((aliados) => aliados.every(aliado =>
            typeof aliado === 'string' &&
            aliado.trim().length >= 2 &&  // Cambio: longitud mínima de 2 caracteres
            aliado.trim().length <= 60
        )).withMessage('Cada aliado debe ser una cadena de texto sin espacios en blanco y tener entre 2 y 60 caracteres'),

    body('enemigos')
        .optional()
        .isArray().withMessage('Los enemigos deben ser un arreglo')
        .custom((enemigos) => enemigos.every(enemigo =>
            typeof enemigo === 'string' &&
            enemigo.trim().length >= 2 &&  // Cambio: longitud mínima de 2 caracteres
            enemigo.trim().length <= 60
        )).withMessage('Cada enemigo debe ser una cadena de texto sin espacios en blanco y tener entre 2 y 60 caracteres')
];

// Validación para actualizar un superhéroe
export const actualizarSuperHeroeValidation = [
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido'),

    body('nombreSuperHeroe')
        .optional()
        .notEmpty().withMessage('El nombre del superhéroe no puede estar vacío')
        .isString().withMessage('El nombre del superhéroe debe ser una cadena de texto')
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('El nombre del superhéroe debe tener entre 3 y 60 caracteres'),

    body('nombreReal')
        .optional()
        .notEmpty().withMessage('El nombre real no puede estar vacío')
        .isString().withMessage('El nombre real debe ser una cadena de texto')
        .trim()
        .isLength({ min: 3, max: 60 }).withMessage('El nombre real debe tener entre 3 y 60 caracteres'),

    body('edad')
        .optional()
        .isInt({ min: 0 }).withMessage('La edad debe ser un número entero mayor o igual a 0')
        .toInt(),

    body('poderes')
        .optional()
        .isArray({ min: 1 }).withMessage('Debe proporcionar al menos un poder')
        .custom((poderes) => poderes.every(poder =>
            typeof poder === 'string' &&
            poder.trim().length >= 2 &&
            poder.trim().length <= 60
        )).withMessage('Cada poder debe tener entre 2 y 60 caracteres'),

    body('planetaOrigen')
        .optional()
        .notEmpty().withMessage('El planeta de origen no puede estar vacío'),

    body('debilidad')
        .optional()
        .notEmpty().withMessage('La debilidad no puede estar vacía'),

    body('aliados')
        .optional()
        .isArray().withMessage('Los aliados deben ser un arreglo')
        .custom((aliados) => aliados.every(aliado =>
            typeof aliado === 'string' &&
            aliado.trim().length >= 2 &&  // Cambio: longitud mínima de 2 caracteres
            aliado.trim().length <= 60
        )).withMessage('Cada aliado debe ser una cadena de texto sin espacios en blanco y tener entre 2 y 60 caracteres'),

    body('enemigos')
        .optional()
        .isArray().withMessage('Los enemigos deben ser un arreglo')
        .custom((enemigos) => enemigos.every(enemigo =>
            typeof enemigo === 'string' &&
            enemigo.trim().length >= 2 &&  // Cambio: longitud mínima de 2 caracteres
            enemigo.trim().length <= 60
        )).withMessage('Cada enemigo debe ser una cadena de texto sin espacios en blanco y tener entre 2 y 60 caracteres')
];

// Validación para eliminar un superhéroe
export const eliminarSuperheroeValidation = [
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido')
];
