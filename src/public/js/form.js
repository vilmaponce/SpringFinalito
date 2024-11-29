document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validation functions
        const validateText = (value, minLength, maxLength) => {
            const trimmedValue = value.trim();
            return trimmedValue.length >= minLength && trimmedValue.length <= maxLength;
        };
        
        const validateArray = (value, minLength, maxLength) => {
            const items = value.split(',')
                .map(item => item.trim())
                .filter(item => item !== '');
            
            return items.length > 0 && 
                   items.every(item => item.length >= minLength && item.length <= maxLength);
        };
        
        // Validation checks
        const heroName = document.getElementById('heroName').value;
        const realName = document.getElementById('realName').value;
        const heroAge = document.getElementById('heroAge').value;
        const planetaOrigen = document.getElementById('planetaOrigen').value;
        const debilidad = document.getElementById('debilidad').value;
        const poderes = document.getElementById('poderes').value;
        const aliados = document.getElementById('aliados').value;
        const enemigos = document.getElementById('enemigos').value;
        
        const errors = [];
        
        // Validate Hero Name
        if (!validateText(heroName, 3, 60)) {
            errors.push('El nombre del superhéroe debe tener entre 3 y 60 caracteres');
        }
        
        // Validate Real Name
        if (!validateText(realName, 3, 60)) {
            errors.push('El nombre real debe tener entre 3 y 60 caracteres');
        }
        
        // Validate Age
        if (heroAge === '' || parseInt(heroAge) < 0) {
            errors.push('La edad debe ser un número entero mayor o igual a 0');
        }
        
        // Validate Planet of Origin
        if (!validateText(planetaOrigen, 2, 60)) {
            errors.push('El planeta de origen es obligatorio y debe tener entre 2 y 60 caracteres');
        }
        
        // Validate Weakness
        if (!validateText(debilidad, 2, 60)) {
            errors.push('La debilidad es obligatoria y debe tener entre 2 y 60 caracteres');
        }
        
        // Validate Powers
        if (!validateArray(poderes, 2, 60)) {
            errors.push('Debe proporcionar al menos un poder de 2 a 60 caracteres');
        }
        
        // Optional: Validate Allies (if provided)
        if (aliados && !validateArray(aliados, 2, 60)) {
            errors.push('Los aliados deben tener entre 2 y 60 caracteres');
        }
        
        // Optional: Validate Enemies (if provided)
        if (enemigos && !validateArray(enemigos, 2, 60)) {
            errors.push('Los enemigos deben tener entre 2 y 60 caracteres');
        }
        
        // Display or handle errors
        if (errors.length > 0) {
            alert('Por favor, corrija los siguientes errores:\n' + errors.join('\n'));
            return;
        }
        
        // If all validations pass, submit the form
        form.submit();
    });
});