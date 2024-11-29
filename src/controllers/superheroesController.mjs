import mongoose from 'mongoose';
import {
  obtenerSuperheroePorId,
  obtenerTodosLosSuperheroes,
  buscarSuperheroesPorAtributo,
  obtenerSuperheroesMayoresDe30YconFiltros
} from '../services/superheroesService.mjs';
import superHeroRepository from '../repositories/SuperHeroRepository.mjs';
import { validationResult } from 'express-validator';

import { renderizarSuperheroe, renderizarListaSuperheroes } from '../views/responseView.mjs';


export async function obtenerSuperheroePorIdController(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ mensaje: "ID no válido" });
  }

  try {
    const superheroe = await obtenerSuperheroePorId(id);
    if (superheroe) {
      res.send(renderizarSuperheroe(superheroe));
    } else {
      res.status(404).send({ mensaje: "Superhéroe no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el superhéroe:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
}


export async function obtenerTodosLosSuperheroesController(req, res) {
  try {
    const superheroes = await obtenerTodosLosSuperheroes();
    // Verifica si la lista de superhéroes está vacía
    if (superheroes.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron superhéroes" });
    }
    res.send(renderizarListaSuperheroes(superheroes));
  } catch (error) {
    console.error("Error al obtener todos los superhéroes:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
}

// Controlador para buscar superhéroes por atributo
export async function buscarSuperheroesPorAtributoController(req, res) {
  const { atributo, valor } = req.params; // Obtener los parámetros de la URL

  if (!atributo || !valor) {
    return res.status(400).send({ mensaje: "Faltan parámetros requeridos" });
  }

  try {
    const superheroes = await buscarSuperheroesPorAtributo(atributo, valor); // Usar la función importada
    if (superheroes.length > 0) {
      res.send(renderizarListaSuperheroes(superheroes));
    } else {
      res.status(404).send({ mensaje: "No se encontraron superhéroes con ese atributo" });
    }
  } catch (error) {
    console.error("Error al buscar superhéroes por atributo:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
}


export async function obtenerSuperheroesMayoresDe30YConFiltrosController(req, res) {
  try {
    const superheroes = await obtenerSuperheroesMayoresDe30YconFiltros();
    if (superheroes.length === 0) {
      return res.status(404).send({ mensaje: "No se encontraron superhéroes mayores de 30 años" });
    }
    res.send(renderizarListaSuperheroes(superheroes));
  } catch (error) {
    console.error("Error al obtener superhéroes:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
}


//Nuevas Peticiones 

export async function crearSuperheroeController(req, res) {
  // Verifica si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Errores de validación:", errors.array()); // Asegúrate de que los errores se están registrando en la consola
    return res.status(400).json({ errores: errors.array() });
  }

  // Desestructuración de los datos del cuerpo de la solicitud
  const {
    nombreSuperHeroe, // Este campo debe coincidir con el nombre que recibes en el frontend
    nombreReal,
    edad,
    planetaOrigen,
    debilidad,
    poderes,
    aliados,
    enemigos
  } = req.body;

  // Verifica que los campos necesarios no estén vacíos
  if (!nombreSuperHeroe || !nombreReal) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos (nombreSuperHeroe y nombreReal)' });
  }

  // Procesar las cadenas en arrays si es necesario
  const poderesArray = (typeof poderes === 'string' && poderes.trim()) ? poderes.split(',').map(poder => poder.trim()) : [];
  const aliadosArray = (typeof aliados === 'string' && aliados.trim()) ? aliados.split(',').map(aliado => aliado.trim()) : [];
  const enemigosArray = (typeof enemigos === 'string' && enemigos.trim()) ? enemigos.split(',').map(enemigo => enemigo.trim()) : [];

  try {
    // Llamada al repositorio para crear el superhéroe en la base de datos
    const nuevoSuperheroe = await superHeroRepository.crearSuperheroe({
      nombreSuperHeroe, // Asegúrate de que este campo esté recibiendo correctamente el valor del frontend
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      poderes: poderesArray,
      aliados: aliadosArray,
      enemigos: enemigosArray
    });

    // Respuesta exitosa (creación del superhéroe)
    return res.status(201).json({
      mensaje: "Superhéroe creado correctamente",
      superheroe: nuevoSuperheroe
    });

  } catch (error) {
    // Si ocurre un error durante la creación (por ejemplo, problemas con la base de datos)
    console.error("Error al crear superhéroe:", error);

    // Respuesta en caso de error interno del servidor
    return res.status(500).json({
      mensaje: "Error interno del servidor al crear el superhéroe",
      detalles: error.message || error
    });
  }
}

export async function actualizarSuperheroeController(req, res) {
  const { id } = req.params;
  const { nombreSuperHeroe, nombreReal, edad, planetaOrigen, debilidad, poderes, aliados, enemigos } = req.body;

  // Verifica si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Errores de validación:", errors.array()); // Asegúrate de que los errores se están registrando
    return res.status(400).json({ errores: errors.array() });
  }

  // Validar que los campos importantes no estén vacíos
  if (!nombreSuperHeroe || !nombreReal || !edad || !planetaOrigen) {
    return res.status(400).json({ mensaje: "Faltan datos requeridos" });
  }

  // Validación de tipos y valores
  if (typeof edad !== 'number' || edad <= 0) {
    return res.status(400).json({ mensaje: "La edad debe ser un número positivo" });
  }

  // Procesar las cadenas en arrays si es necesario para la actualización
  const poderesArray = (typeof poderes === 'string' && poderes.trim()) ? poderes.split(',').map(poder => poder.trim()) : [];
  const aliadosArray = (typeof aliados === 'string' && aliados.trim()) ? aliados.split(',').map(aliado => aliado.trim()) : [];
  const enemigosArray = (typeof enemigos === 'string' && enemigos.trim()) ? enemigos.split(',').map(enemigo => enemigo.trim()) : [];

  try {
    // Llama al repositorio para actualizar los datos del superhéroe
    const superheroeActualizado = await superHeroRepository.actualizarSuperheroe(id, {
      nombreSuperHeroe,
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      poderes: poderesArray,
      aliados: aliadosArray,
      enemigos: enemigosArray
    });

    if (superheroeActualizado) {
      // Devuelve los datos actualizados o un mensaje de éxito
      res.status(200).json({ mensaje: "Superhéroe actualizado correctamente", superheroe: superheroeActualizado });
    } else {
      // Si no se encuentra el superhéroe
      res.status(404).json({ mensaje: "Superhéroe no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar superhéroe:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// controllers/superheroesController.mjs

export async function mostrarFormularioDeEdicion(req, res) {
  const { id } = req.params;

  console.log('Ruta de edición llamada');
  console.log('ID recibido:', id);
  console.log('Tipo de ID:', typeof id);

  // Validación de ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('ID de superhéroe inválido');
    return res.status(400).json({
      mensaje: "ID de superhéroe inválido",
      id: id
    });
  }

  try {
    const superheroe = await SuperHero.findById(id);

    console.log('Resultado de búsqueda:', superheroe);

    if (!superheroe) {
      console.log('Superhéroe no encontrado');
      return res.status(404).json({
        mensaje: "Superhéroe no encontrado",
        id: id
      });
    }

    res.render('editar-superheroe', { superheroe });
  } catch (error) {
    console.error("Error al buscar superhéroe:", error);
    res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message
    });
  }
}



export async function eliminarSuperheroeController(req, res) {
  const { id } = req.params;

  try {
    const superheroeEliminado = await superHeroRepository.eliminarSuperheroe(id);

    if (superheroeEliminado) {
      res.status(200).send({ mensaje: "Superhéroe eliminado correctamente" });
    } else {
      res.status(404).send({ mensaje: "Superhéroe no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar superhéroe:", error);
    res.status(500).send({ mensaje: "Error interno del servidor" });
  }
}