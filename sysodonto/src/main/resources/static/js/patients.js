class PatientsManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        console.log('PatientsManager inicializado com SweetAlert2');
    }
    
    bindEvents() {
        this.bindConfirmationActions();
    }
    
    bindConfirmationActions() {
        console.log('Ações vinculadas - SweetAlert2 pronto para uso');
    }
    
    showConfirmation(options) {
        const defaultOptions = {
            title: 'Confirmar ação',
            text: 'Tem certeza que deseja realizar esta ação?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3498db',
            cancelButtonColor: '#6c757d',
            reverseButtons: true
        };
        
        return Swal.fire({ ...defaultOptions, ...options });
    }
    
    showSuccess(message, title = 'Sucesso!') {
        return Swal.fire({
            title: title,
            text: message,
            icon: 'success',
            confirmButtonColor: '#27ae60',
            confirmButtonText: 'OK'
        });
    }
    
    showError(message, title = 'Erro!') {
        return Swal.fire({
            title: title,
            text: message,
            icon: 'error',
            confirmButtonColor: '#e74c3c',
            confirmButtonText: 'OK'
        });
    }

    showInfo(message, title = 'Informação') {
        return Swal.fire({
            title: title,
            text: message,
            icon: 'info',
            confirmButtonColor: '#3498db',
            confirmButtonText: 'Entendi'
        });
    }
	
    confirmDeletePatient(patientName) {
        return this.showConfirmation({
            title: 'Excluir Paciente',
            text: `Tem certeza que deseja excluir o paciente "${patientName}"? Esta ação não pode ser desfeita.`,
            icon: 'warning',
            confirmButtonText: 'Sim, excluir',
            confirmButtonColor: '#e74c3c',
            showDenyButton: true,
            denyButtonText: 'Cancelar'
        });
    }
    
    confirmDeactivatePatient(patientName) {
        return this.showConfirmation({
            title: 'Inativar Paciente',
            text: `Tem certeza que deseja inativar o paciente "${patientName}"? Ele não aparecerá mais na lista principal.`,
            icon: 'question',
            confirmButtonText: 'Sim, inativar',
            confirmButtonColor: '#f39c12'
        });
    }
    
    formatCPF(cpf) {
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    formatPhone(phone) {
        if (!phone) return '';
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    showLoading(title = 'Processando...') {
        Swal.fire({
            title: title,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    closeLoading() {
        Swal.close();
    }
    
    async exampleWorkflow() {
        try {
            const result = await this.showConfirmation({
                title: 'Exemplo de Ação',
                text: 'Esta é uma demonstração do SweetAlert2 em ação.'
            });
            
            if (result.isConfirmed) {
                this.showLoading('Processando ação...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.closeLoading();
                await this.showSuccess('Ação realizada com sucesso!');
            }
        } catch (error) {
            this.showError('Ocorreu um erro durante o processo.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.patientsManager = new PatientsManager();
    
    console.log('SweetAlert2 integrado e pronto para uso');
    
    document.querySelectorAll('[data-confirm]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const message = this.getAttribute('data-confirm-message') || 'Tem certeza que deseja realizar esta ação?';
            const href = this.getAttribute('href');
            
            window.patientsManager.showConfirmation({
                text: message
            }).then((result) => {
                if (result.isConfirmed && href) {
                    window.location.href = href;
                }
            });
        });
    });
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatientsManager;
}