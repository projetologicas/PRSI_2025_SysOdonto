class PatientFormManager {
    constructor() {
        this.fileInput = document.getElementById("patientPictureFile");
        this.preview = document.getElementById("patientPicturePreview");
        this.hiddenBase64 = document.getElementById("patientPictureBase64");
        this.cpfInput = document.getElementById("cpf");
        this.telephoneInput = document.getElementById("telephone");
        this.form = document.getElementById("patientForm");
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupFormValidation();
        console.log('PatientFormManager inicializado');
    }
    
    bindEvents() {
        if (this.preview && this.fileInput) {
            this.preview.addEventListener("click", () => {
                this.fileInput.click();
            });
            
            this.fileInput.addEventListener("change", () => {
                this.handleImageUpload();
            });
        }

        if (this.cpfInput) {
            this.cpfInput.addEventListener("input", (e) => {
                this.formatCPF(e);
            });
        }
        
        if (this.telephoneInput) {
            this.telephoneInput.addEventListener("input", (e) => {
                this.formatTelephone(e);
            });
        }
        
        if (this.form) {
            this.form.addEventListener("submit", (e) => {
                this.handleFormSubmit(e);
            });
        }
    }
    
    handleImageUpload() {
        const file = this.fileInput.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showAlert('Por favor, selecione uma imagem válida.', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showAlert('A imagem deve ter no máximo 5MB.', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const base64 = e.target.result;
            this.hiddenBase64.value = base64;
            this.preview.style.backgroundImage = `url('${base64}')`;
            this.preview.innerHTML = "";
            
            this.showAlert('Foto carregada com sucesso!', 'success');
        };
        
        reader.onerror = () => {
            this.showAlert('Erro ao carregar a imagem.', 'error');
        };
        
        reader.readAsDataURL(file);
    }
    
    formatCPF(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d)/, '$1.$2')
                         .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        
        e.target.value = value;
    }
    
    formatTelephone(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/(\d{2})(\d)/, '($1) $2')
                         .replace(/(\d{5})(\d)/, '$1-$2');
        }
        
        e.target.value = value;
    }
    
    setupFormValidation() {
        if (this.form) {
            this.form.setAttribute('novalidate', true);
        }
    }
    
    handleFormSubmit(e) {
        if (!this.validateForm()) {
            e.preventDefault();
            return;
        }

        if (!this.validateCPF()) {
            e.preventDefault();
            this.showAlert('Por favor, insira um CPF válido.', 'error');
            return;
        }
        
        if (!this.validateTelephone()) {
            e.preventDefault();
            this.showAlert('Por favor, insira um telefone válido.', 'error');
            return;
        }
        
        this.showLoading();
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.highlightField(field, false);
            } else {
                this.highlightField(field, true);
            }
        });
        
        return isValid;
    }
    
    validateCPF() {
        if (!this.cpfInput) return true;
        
        const cpf = this.cpfInput.value.replace(/\D/g, '');
        return cpf.length === 11;
    }
    
    validateTelephone() {
        if (!this.telephoneInput) return true;
        
        const phone = this.telephoneInput.value.replace(/\D/g, '');
        return phone.length >= 10 && phone.length <= 11;
    }
    
    highlightField(field, isValid) {
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }
    }
    
    showAlert(message, type = 'info') {
        if (typeof Swal !== 'undefined') {
            const config = {
                title: type === 'error' ? 'Erro!' : 'Sucesso!',
                text: message,
                icon: type,
                confirmButtonText: 'OK',
                confirmButtonColor: type === 'error' ? '#e74c3c' : '#27ae60'
            };
            
            Swal.fire(config);
        } else {
            alert(message);
        }
    }
    
    showLoading() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processando...';
            submitButton.disabled = true;
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 5000);
        }
    }

    clearForm() {
        if (this.form) {
            this.form.reset();
            this.preview.style.backgroundImage = '';
            this.preview.innerHTML = '<i class="fas fa-camera"></i>';
            this.hiddenBase64.value = '';
        }
    }
	
    fillWithSampleData() {
        if (this.form) {
            document.getElementById('name').value = 'João da Silva';
            document.getElementById('cpf').value = '123.456.789-00';
            document.getElementById('telephone').value = '(16) 99999-9999';
            document.getElementById('birthDate').value = '1990-01-01';
            document.getElementById('startTreatmentDate').value = '2024-01-01';
            document.getElementById('observations').value = 'Paciente exemplo para teste';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.patientFormManager = new PatientFormManager();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatientFormManager;
}