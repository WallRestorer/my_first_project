document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    const bioTextarea = document.getElementById('bio');
    const charCount = document.getElementById('charCount');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    if (bioTextarea && charCount) {
        bioTextarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }

    inputs.forEach(input => {
       
        if (input.type !== 'checkbox' && input.type !== 'radio') {
            input.addEventListener('blur', validateField);
        }
        input.addEventListener('input', clearError);
    });

    if (password && confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            validatePasswordMatch();
        });
        password.addEventListener('input', function() {
            if (confirmPassword.value) validatePasswordMatch();
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;

        inputs.forEach(input => {
            
            if ((input.type === 'checkbox' || input.type === 'radio') && !input.required) return;
            
            if (input.type === 'checkbox' && input.required) {
                if (!input.checked) {
                    showErrorForField(input, 'Это поле обязательно для заполнения');
                    isValid = false;
                } else {
                    clearErrorForField(input);
                }
                return;
            }

            if (!validateField({ target: input })) {
                isValid = false;
            }
        });

        if (password && confirmPassword) {
            if (!validatePasswordMatch()) {
                isValid = false;
            }
        }

        if (isValid) {
            alert('Форма успешно отправлена! (Эмуляция)');
            // form.submit(); // Раскомментировать для реальной отправки
        } else {
            alert('Пожалуйста, исправьте ошибки в форме');
        }
    });

    form.addEventListener('reset', function() {
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        if (charCount) charCount.textContent = '0';
    });
});

function validateField(e) {
    const field = e.target;
    
    if (!field.required && !field.value.trim()) {
        clearErrorForField(field);
        return true;
    }

    if (!field.checkValidity()) {
        showErrorForField(field, getErrorMessage(field));
        return false;
    } else {
        clearErrorForField(field);
        return true;
    }
}

function validatePasswordMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    if (confirmPasswordValue && passwordValue !== confirmPasswordValue) {
        showErrorForField(confirmPassword, 'Пароли не совпадают');
        return false;
    } else {
        clearErrorForField(confirmPassword);
        return true;
    }
}

function getErrorMessage(field) {
    if (field.validity.valueMissing) {
        return 'Это поле обязательно для заполнения';
    }

    if (field.validity.typeMismatch) {
        if (field.type === 'email') {
            return 'Введите корректный email адрес';
        }
    }

    if (field.validity.tooShort) {
        return `Минимальная длина: ${field.minLength} символов`;
    }

    if (field.validity.tooLong) {
        return `Максимальная длина: ${field.maxLength} символов`;
    }

    if (field.validity.patternMismatch) {
        if (field.type === 'password') {
            return 'Пароль должен содержать заглавные и строчные буквы, цифры';
        }
        if (field.type === 'tel') {
            return 'Введите телефон в формате +7 (999) 999-99-99';
        }
    }

    return 'Некорректное значение';
}

function showErrorForField(field, message) {
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
}

function clearErrorForField(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
}

function clearError(e) {
    const field = e.target;
    if (field.checkValidity()) {
        clearErrorForField(field);
    }
}