import mongoose from 'mongoose';

const superheroSchema = new mongoose.Schema({
    nombreSuperHeroe: { type: String, required: true },
    nombreReal: { type: String, required: true },
    edad: { type: Number, min: 0 },
    planetaOrigen: { type: String, default: 'Desconocido' },
    debilidad: String,
    poderes: [String],
    aliados: [String],
    enemigos: [String],
    autor: { type: String, default: 'Vilma Ponce' },
    createdAt: { type: Date, default: Date.now }
    
});

export default mongoose.model('SuperHero', superheroSchema, 'Grupo-02');
