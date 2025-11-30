package br.edu.ifsp.sysodonto.filters;

import java.util.Date;

public class PatientFilter {
    private String name;
    private String cpf;
    private String telephone;
    private Date birthDate;
    private Date treatmentDate;

    public PatientFilter() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public Date getTreatmentDate() {
        return treatmentDate;
    }

    public void setTreatmentDate(Date treatmentDate) {
        this.treatmentDate = treatmentDate;
    }

    public boolean isEmpty() {
        return (name == null || name.trim().isEmpty()) &&
               (cpf == null || cpf.trim().isEmpty()) &&
               (telephone == null || telephone.trim().isEmpty()) &&
               birthDate == null &&
               treatmentDate == null;
    }
}