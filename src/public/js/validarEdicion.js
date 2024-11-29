document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Función de validación para texto
        const validateText = (value, minLength, maxLength) => {
            const trimmedValue = value.trim();
            return trimmedValue.length >= minLength && trimmedValue.length <= maxLength;
        };
        
        // Función de validación para arrays (separados por coma)
        const validateArray = (value, minLength, maxLength) => {
            const items = value.split(',')
                .map(item => item.trim())
                .filter(item => item !== ''); // Elimina los vacíos
            
            return items.length > 0 && 
                   items.every(item => item.length >= minLength && item.length <= maxLength);
        };
        
        // Obtener los valores del formulario
        const heroName = document.getElementById('heroName').value;
        const realName = document.getElementById('realName').value;
        const heroAge = document.getElementById('heroAge').value;
        const planetaOrigen = document.getElementById('planetaOrigen').value;
        const debilidad = document.getElementById('debilidad').value;
        const poderes = document.getElementById('poderes').value;
        const aliados = document.getElementById('aliados').value;
        const enemigos = document.getElementById('enemigos').value;
        
        const errors = [];
        
        // Validar Nombre del Superhéroe
        if (!validateText(heroName, 3, 60)) {
            errors.push('El nombre del superhéroe debe tener entre 3 y 60 caracteres');
        }
        
        // Validar Nombre Real
        if (!validateText(realName, 3, 60)) {
            errors.push('El nombre real debe tener entre 3 y 60 caracteres');
        }
        
        // Validar Edad (número entero mayor o igual a 0)
        if (heroAge === '' || parseInt(heroAge) < 0) {
            errors.push('La edad debe ser un número entero mayor o igual a 0');
        }
        
        // Validar Planeta de Origen
        if (!validateText(planetaOrigen, 2, 60)) {
            errors.push('El planeta de origen es obligatorio y debe tener entre 2 y 60 caracteres');
        }
        
        // Validar Debilidad
        if (!validateText(debilidad, 2, 60)) {
            errors.push('La debilidad es obligatoria y debe tener entre 2 y 60 caracteres');
        }
        
        // Validar Poderes (al menos un poder de 2 a 60 caracteres)
        if (!validateArray(poderes, 2, 60)) {
            errors.push('Debe proporcionar al menos un poder, y cada poder debe tener entre 2 y 60 caracteres');
        }
        
        // Validar Aliados (si proporcionados, al menos un aliado con 2 a 60 caracteres)
        if (aliados && !validateArray(aliados, 2, 60)) {
            errors.push('Los aliados deben tener entre 2 y 60 caracteres');
        }
        
        // Validar Enemigos (si proporcionados, al menos un enemigo con 2 a 60 caracteres)
        if (enemigos && !validateArray(enemigos, 2, 60)) {
            errors.push('Los enemigos deben tener entre 2 y 60 caracteres');
        }
        
        // Mostrar o manejar errores
        if (errors.length > 0) {
            alert('Por favor, corrija los siguientes errores:\n' + errors.join('\n'));
            return; // Detener el envío del formulario si hay errores
        }
        
        // Si todas las validaciones pasan, enviar el formulario
        form.submit();
    });
});
