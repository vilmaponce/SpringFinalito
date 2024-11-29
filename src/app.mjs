import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { connectDB } from './config/dbConfig.mjs';
import superHeroRoutes from './routes/superHeroRoutes.mjs';
import SuperHero from './models/SuperHero.mjs';
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';

// Definir el middleware de validación
const actualizarSuperHeroeValidation = [
  body('heroName').notEmpty().withMessage('El nombre del superhéroe es obligatorio'),
  body('realName').notEmpty().withMessage('El nombre real es obligatorio'),
  body('heroAge').isInt({ min: 0 }).withMessage('La edad debe ser un número entero mayor que 0'),
 
];

const app = express();
const PORT = process.env.PORT || 3000;

// Obtener __dirname en un módulo ESM
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Middleware para servir archivos estáticos
app.use(express.static(path.resolve('./public')));

// Conexión a la base de datos
connectDB();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Configurar express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware para procesar datos del formulario
app.use(bodyParser.urlencoded({ extended: true })); // Formularios
app.use(express.json()); // JSON adicional


// Middleware para establecer 'title' de manera global
app.use((req, res, next) => {
  res.locals.title = 'Lista de Superhéroes'; // Establece un título globalmente
  next();
});

// Middleware para loguear las rutas de las solicitudes
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path);
  next();
});

// Ruta para la página principal
app.get('/', async (req, res) => {
  try {
    const superheroes = await SuperHero.find();
    res.render('index', {
      title: 'Lista de Superhéroes',
      superheroes: superheroes  // Use the fetched superheroes instead of undefined superheroesList
    });
  } catch (error) {
    console.error('Error fetching superheroes:', error);
    res.status(500).send('Error al cargar superhéroes');
  }
});

// Ruta para obtener todos los superhéroes
app.get('/superheroes', async (req, res) => {
  try {
    const superheroes = await SuperHero.find();
    res.render('index', { superheroes }); // Esto pasa los datos de superhéroes correctamente
  } catch (err) {
    console.error('Error al obtener superhéroes:', err);
    res.status(500).send('Error al obtener los superhéroes');
  }
});

// Muestra el formulario para añadir un superhéroe
// Ruta para mostrar el formulario de añadir superhéroe
app.get('/add-hero', (req, res) => {
  res.render('form');
});


// POST /superheroes: Crea un nuevo superhéroe en la base de datos.
//Crea un nuevo superhéroe en la base de datos.
app.post('/superheroes', async (req, res) => {
  console.log('Superhero Creation Route Triggered');
  console.log('Full Request Body:', req.body);

  const { heroName, realName, heroAge, planetaOrigen, debilidad, poderes, aliados, enemigos } = req.body;

  // Detailed validation logging
  console.log('Received Data:', {
    heroName,
    realName,
    heroAge,
    planetaOrigen,
    debilidad,
    poderes,
    aliados,
    enemigos
  });

  // Validate critical fields
  if (!heroName || !realName || !heroAge) {
    console.error('Missing critical fields');
    return res.status(400).send('Faltan datos esenciales para crear el superhéroe');
  }

  try {
    const nuevoSuperHeroe = new SuperHero({
      nombreSuperHeroe: heroName,
      nombreReal: realName,
      edad: parseInt(heroAge),
      planetaOrigen,
      debilidad,
      poderes: poderes ? poderes.split(',').map(p => p.trim()) : [],
      aliados: aliados ? aliados.split(',').map(a => a.trim()) : [],
      enemigos: enemigos ? enemigos.split(',').map(e => e.trim()) : []
    });

    await nuevoSuperHeroe.save();
    console.log('Superhero Created Successfully');
    res.redirect('/superheroes');
  } catch (error) {
    console.error('Error Creating Superhero:', error);
    res.status(500).send('Error al crear el superhéroe: ' + error.message);
  }
});


console.log('Route registration check:');
console.log('Current routes:', 
  app._router.stack
    .filter(r => r.route)
    .map(r => `${Object.keys(r.route.methods)[0].toUpperCase()}: ${r.route.path}`));



// Ruta para editar un superhéroe
//Muestra el formulario de edición para un superhéroe específico.
app.get('/superheroes/editar/:id', async (req, res) => {
  console.log('Ruta de edición llamada');
  const { id } = req.params;
  console.log('ID recibido:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('ID no válido');
    return res.status(400).send('ID no válido');
  }

  try {
    const superHeroe = await SuperHero.findById(id);
    if (!superHeroe) {
      console.log('Superhéroe no encontrado');
      return res.status(404).send('Superhéroe no encontrado');
    }

    console.log('Superhéroe encontrado:', superHeroe.nombreSuperHeroe);
    res.render('editar-superheroe', { superheroe: superHeroe });
  } catch (err) {
    console.error('Error al obtener el superhéroe:', err);
    res.status(500).send('Error al obtener los datos del superhéroe');
  }
});


// Ruta para manejar la actualización de un superhéroe
//Actualiza los datos del superhéroe en la base de datos.
app.put('/superheroes/editar/:id', 
  actualizarSuperHeroeValidation, // Middleware de validación
  async (req, res) => {
    // Verificar si hay errores en la validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { heroName, realName, heroAge, planetaOrigen, debilidad, poderes, aliados, enemigos } = req.body;

    try {
      const updatedHeroe = await SuperHero.findByIdAndUpdate(id, {
        nombreSuperHeroe: heroName,
        nombreReal: realName,
        edad: heroAge,
        planetaOrigen,
        debilidad,
        poderes: poderes ? poderes.split(',') : [],
        aliados: aliados ? aliados.split(',') : [],
        enemigos: enemigos ? enemigos.split(',') : []
      }, { new: true });

      // Redirigir después de actualizar el superhéroe
      res.redirect('/superheroes');
    } catch (error) {
      res.status(500).send('Error al actualizar el superhéroe');
    }
  }
);

app.post('/superheroes/editar/:id', 
  actualizarSuperHeroeValidation,  // Add validation middleware
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation Errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { heroName, realName, heroAge, planetaOrigen, debilidad, poderes, aliados, enemigos } = req.body;

    console.log('Update Request Body:', req.body);  // Add logging

    try {
      const updatedHeroe = await SuperHero.findByIdAndUpdate(id, {
        nombreSuperHeroe: heroName,
        nombreReal: realName,
        edad: heroAge,
        planetaOrigen,
        debilidad,
        poderes: poderes ? poderes.split(',').map(p => p.trim()) : [],
        aliados: aliados ? aliados.split(',').map(a => a.trim()) : [],
        enemigos: enemigos ? enemigos.split(',').map(e => e.trim()) : []
      }, { new: true });

      if (!updatedHeroe) {
        console.log('No superhero found with ID:', id);
        return res.status(404).send('Superhéroe no encontrado');
      }

      console.log('Superhero updated successfully');
      res.redirect('/superheroes');
    } catch (error) {
      console.error('Error updating superhero:', error);
      res.status(500).send('Error al actualizar el superhéroe');
    }
  }
);

// Ruta para eliminar un superhéroe
app.post('/delete-hero/:id', async (req, res) => {
  console.log('Ruta de eliminación activada');
  const { id } = req.params;

  try {
    const hero = await SuperHero.findByIdAndDelete(id);

    if (!hero) {
      return res.status(404).json({ mensaje: 'Superhéroe no encontrado' });
    }

    res.redirect('/superheroes'); // Redirigir después de eliminar
  } catch (err) {
    console.error('Error al eliminar el superhéroe:', err);
    res.status(500).json({ mensaje: 'Error al eliminar el superhéroe' });
  }
});

// Configuración de rutas API
app.use('/api', superHeroRoutes);


// Manejador de ruta no encontrada
app.use((req, res) => {
  res.status(404).send({ mensaje: "Ruta no encontrada" });
});


// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
