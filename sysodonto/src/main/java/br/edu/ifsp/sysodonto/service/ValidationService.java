package br.edu.ifsp.sysodonto.service;

import org.springframework.stereotype.Service;

@Service
public class ValidationService {

    public boolean isValidCPF(String cpf) {
        if (cpf == null || cpf.trim().isEmpty()) {
            return false;
        }

        cpf = cpf.replaceAll("[^0-9]", "");
        
        if (cpf.length() != 11) {
            return false;
        }
        
        return true;
    }

    public boolean isValidPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return false;
        }
        phone = phone.replaceAll("[^0-9]", "");
        
        return phone.length() == 10 || phone.length() == 11;
    }
}