import mongoose from 'mongoose';
import SuperHero from '../models/SuperHero.mjs';
import IRepository from './IRepository.mjs';

// Definimos la clase SuperHeroRepository que extiende IRepository
class SuperHeroRepository extends IRepository {

  // Obtener un superhéroe por su ID
  async obtenerPorId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID no válido");
    }

    try {
      return await SuperHero.findById(id);
    } catch (error) {
      console.error('Error al obtener superhéroe por ID:', error);
      throw error;
    }
  }

  // Obtener todos los superhéroes
  async obtenerTodos() {
    try {
      return await SuperHero.find({});
    } catch (error) {
      console.error('Error al obtener todos los superhéroes:', error);
      throw error;
    }
  }

  // Buscar superhéroes por un atributo
  async buscarPorAtributo(atributo, valor) {
    const query = { [atributo]: new RegExp(valor, 'i') };
    try {
      return await SuperHero.find(query);
    } catch (error) {
      console.error(`Error al buscar superhéroes por ${atributo}:`, error);
      throw error;
    }
  }

  // Obtener superhéroes mayores de 30 años
  async obtenerMayoresDe30() {
    try {
      return await SuperHero.find({
        edad: { $gt: 30 },
        planetaOrigen: 'Tierra',
        $expr: { $gte: [{ $size: "$poderes" }, 2] }
      });
    } catch (error) {
      console.error('Error al obtener superhéroes mayores de 30:', error);
      throw error;
    }
  }

  // Método para crear un nuevo superhéroe
  async crearSuperheroe(data) {
    try {
      const nuevoSuperheroe = new SuperHero(data);
      return await nuevoSuperheroe.save();
    } catch (error) {
      console.error('Error al crear superhéroe:', error);
      throw error;
    }
  }

  // Método para actualizar un superhéroe
  async actualizarSuperheroe(id, data) {
    try {
      const superheroeActualizado = await SuperHero.findByIdAndUpdate(id, data, { new: true });
      if (!superheroeActualizado) {
        throw new Error("Superhéroe no encontrado para actualizar");
      }
      return superheroeActualizado;
    } catch (error) {
      console.error(`Error al actualizar superhéroe con ID (${id}):`, error);
      throw error;
    }
  }
  
  // Método para eliminar un superhéroe
  async eliminarSuperheroe(id) {
    try {
      const superheroeEliminado = await SuperHero.findByIdAndDelete(id);
      if (!superheroeEliminado) {
        throw new Error("Superhéroe no encontrado para eliminar");
      }
      return superheroeEliminado;
    } catch (error) {
      console.error(`Error al eliminar superhéroe con ID (${id}):`, error);
      throw error;
    }
  }
}

// Exportar una instancia de la clase para usarla en otros módulos
export default new SuperHeroRepository();