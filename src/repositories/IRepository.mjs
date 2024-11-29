class IRepository {
    obtenerPorId(id){
      throw new Error("Método 'obtenerPorId()' no implementado");
    }
    obtenerTodos(){
      throw new Error("Método 'obtener Todos()' no implementado");
    }
    buscarPorAtributo(atributo, valor) {
      throw new Error("Método 'buscar PorAtributo()' no implementado");
    }
    obtenerMayoresDe30(){
      throw new Error("Método 'obtener MayoresDe30()' no implementado");
    }
  }
  
  export default IRepository;