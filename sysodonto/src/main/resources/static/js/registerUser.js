class RegisterForm {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupValidation();
    }

    bindEvents() {
        const profilePictureInput = document.getElementById('profilePicture');
        const profilePicturePlaceholder = document.getElementById('profilePicturePlaceholder');
        
        if (profilePicturePlaceholder) {
            profilePicturePlaceholder.addEventListener('click', () => {
                profilePictureInput.click();
            });
        }

        if (profilePictureInput) {
            profilePictureInput.addEventListener('change', (event) => {
                this.handleProfilePicture(event);
            });
        }

        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                this.checkPasswordStrength();
                this.checkPasswordMatch();
            });
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.checkPasswordMatch();
            });
        }

        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                this.validateForm(e);
            });
        }

        this.setupAutoDismissAlerts();
    }

    handleProfilePicture(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showToast('Por favor, selecione uma imagem válida.', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showToast('A imagem deve ter no máximo 5MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Input = document.getElementById('profilePictureBase64');
            if (base64Input) {
                base64Input.value = e.target.result;
            }
            
            const placeholder = document.getElementById('profilePicturePlaceholder');
            if (placeholder) {
                placeholder.innerHTML = `<img src="${e.target.result}" alt="Foto de perfil">`;
            }
            
            this.showToast('Foto adicionada com sucesso!', 'success');
        };
        reader.onerror = () => {
            this.showToast('Erro ao carregar a imagem.', 'error');
        };
        reader.readAsDataURL(file);
    }

    checkPasswordStrength() {
        const password = document.getElementById('password');
        const strengthBar = document.getElementById('passwordStrengthBar');
        
        if (!password || !strengthBar) return;
        
        const passwordValue = password.value;
        let strength = 0;
        
        if (passwordValue.length >= 8) strength += 25;
        if (/[a-z]/.test(passwordValue)) strength += 25;
        if (/[A-Z]/.test(passwordValue)) strength += 25;
        if (/[0-9]/.test(passwordValue)) strength += 25;
        
        strengthBar.style.width = strength + '%';
        
        strengthBar.className = 'password-strength-bar';
        if (strength === 0) {
        } else if (strength < 50) {
            strengthBar.classList.add('password-strength-weak');
        } else if (strength < 75) {
            strengthBar.classList.add('password-strength-medium');
        } else {
            strengthBar.classList.add('password-strength-strong');
        }
    }

    checkPasswordMatch() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const message = document.getElementById('passwordMatchMessage');
        const submitBtn = document.getElementById('submitBtn');
        
        if (!password || !confirmPassword || !message || !submitBtn) return;
        
        const passwordValue = password.value;
        const confirmPasswordValue = confirmPassword.value;
        
        if (confirmPasswordValue === '') {
            message.textContent = '';
            message.className = 'form-text';
            submitBtn.disabled = false;
        } else if (passwordValue !== confirmPasswordValue) {
            message.textContent = '❌ As senhas não coincidem';
            message.className = 'form-text text-danger';
            submitBtn.disabled = true;
        } else {
            message.textContent = '✅ Senhas coincidem';
            message.className = 'form-text text-success';
            submitBtn.disabled = false;
        }
    }

    validateForm(e) {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        
        if (!password || !confirmPassword || !name || !email) {
            e.preventDefault();
            this.showToast('Erro no formulário. Recarregue a página e tente novamente.', 'error');
            return false;
        }
        
        const passwordValue = password.value;
        const confirmPasswordValue = confirmPassword.value;
        const nameValue = name.value;
        const emailValue = email.value;
        
        let isValid = true;
        let errorMessage = '';

        if (!nameValue.trim()) {
            errorMessage = 'Por favor, preencha seu nome.';
            isValid = false;
        } else if (!this.isValidEmail(emailValue)) {
            errorMessage = 'Por favor, insira um email válido.';
            isValid = false;
        } else if (passwordValue.length < 6) {
            errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
            isValid = false;
        } else if (passwordValue !== confirmPasswordValue) {
            errorMessage = 'As senhas não coincidem.';
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
            this.showToast(errorMessage, 'error');
            return false;
        }

        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Cadastrando...';
            submitBtn.disabled = true;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupValidation() {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                if (emailInput.value && !this.isValidEmail(emailInput.value)) {
                    this.showFieldError(emailInput, 'Por favor, insira um email válido.');
                } else {
                    this.clearFieldError(emailInput);
                }
            });
        }

        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.addEventListener('blur', () => {
                if (!nameInput.value.trim()) {
                    this.showFieldError(nameInput, 'Por favor, preencha seu nome.');
                } else {
                    this.clearFieldError(nameInput);
                }
            });
        }
    }

    showFieldError(input, message) {
        this.clearFieldError(input);
        input.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }

    clearFieldError(input) {
        input.classList.remove('is-invalid');
        const existingError = input.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
    }

    showToast(message, type = 'info') {
        if (type === 'error') {
            alert('❌ ' + message);
        } else if (type === 'success') {
            alert('✅ ' + message);
        } else {
            alert('ℹ️ ' + message);
        }
    }

    setupAutoDismissAlerts() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            setTimeout(() => {
                if (alert && alert.parentNode) {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                }
            }, 5000);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RegisterForm();
});