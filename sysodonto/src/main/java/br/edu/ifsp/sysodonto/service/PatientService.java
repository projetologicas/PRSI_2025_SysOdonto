package br.edu.ifsp.sysodonto.service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import br.edu.ifsp.sysodonto.exceptions.*;
import br.edu.ifsp.sysodonto.filters.PatientFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ifsp.sysodonto.model.Patient;
import br.edu.ifsp.sysodonto.repository.PatientRepository;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private ValidationService validationService;

    public Patient createPatient(Patient patient) throws ExecutionException, InterruptedException {
        if (!validationService.isValidCPF(patient.getCpf())) {
            throw new InvalidCpfException("CPF inválido");
        }

        if (patientRepository.findByCpf(patient.getCpf()).isPresent()) {
            throw new CpfAlreadyUsedException("CPF já cadastrado");
        }

        if (!validationService.isValidPhone(patient.getTelephone())) {
            throw new InvalidTelephoneException("Telefone inválido");
        }

        if (patientRepository.findByTelephone(patient.getTelephone()).isPresent()) {
            throw new TelephoneAlreadyUsedException("Telefone já cadastrado");
        }

        return patientRepository.save(patient);
    }

    public Optional<Patient> getPatientById(String id) throws ExecutionException, InterruptedException {
        return patientRepository.findById(id);
    }
    
    public List<Patient> getPatientsByUserId(String userId) throws ExecutionException, InterruptedException {
        return patientRepository.findByUserId(userId);
    }

    public List<Patient> getAllPatients() throws ExecutionException, InterruptedException {
        return patientRepository.findAll();
    }

    public Patient updatePatient(String id, Patient patient) throws ExecutionException, InterruptedException {
        Optional<Patient> existingPatient = patientRepository.findById(id);
        if (existingPatient.isEmpty()) {
            throw new PatientNotFoundException("Paciente não encontrado");
        }

        if (!validationService.isValidCPF(patient.getCpf())) {
            throw new InvalidCpfException("CPF inválido");
        }

        Optional<Patient> patientWithSameCpf = patientRepository.findByCpf(patient.getCpf());
        if (patientWithSameCpf.isPresent() && !patientWithSameCpf.get().getId().equals(id)) {
            throw new CpfAlreadyUsedException("CPF já cadastrado em outro paciente");
        }

        if (!validationService.isValidPhone(patient.getTelephone())) {
            throw new InvalidTelephoneException("Telefone inválido");
        }

        Optional<Patient> patientWithSamePhone = patientRepository.findByTelephone(patient.getTelephone());
        if (patientWithSamePhone.isPresent() && !patientWithSamePhone.get().getId().equals(id)) {
            throw new TelephoneAlreadyUsedException("Telefone já cadastrado em outro paciente");
        }

        patient.setId(id);
        return patientRepository.save(patient);
    }

    public boolean deletePatient(String id) throws ExecutionException, InterruptedException {
        return patientRepository.delete(id);
    }

    public boolean cpfExists(String cpf) throws ExecutionException, InterruptedException {
        return patientRepository.findByCpf(cpf).isPresent();
    }

    public boolean phoneExists(String telephone) throws ExecutionException, InterruptedException {
        return patientRepository.findByTelephone(telephone).isPresent();
    }
    
    public List<Patient> getPatientsByFilter(String userId, PatientFilter filter) 
            throws ExecutionException, InterruptedException {
        
        List<Patient> patients = getPatientsByUserId(userId);
        
        if (filter.isEmpty()) {
            return patients;
        }

        return patients.stream()
                .filter(patient -> filterByName(patient, filter.getName()))
                .filter(patient -> filterByCpf(patient, filter.getCpf()))
                .filter(patient -> filterByTelephone(patient, filter.getTelephone()))
                .filter(patient -> filterByBirthDate(patient, filter.getBirthDate()))
                .filter(patient -> filterByTreatmentDate(patient, filter.getTreatmentDate()))
                .collect(Collectors.toList());
    }

    private boolean filterByName(Patient patient, String name) {
        if (name == null || name.trim().isEmpty()) {
            return true;
        }
        return patient.getName() != null && 
               patient.getName().toLowerCase().contains(name.toLowerCase());
    }

    private boolean filterByCpf(Patient patient, String cpf) {
        if (cpf == null || cpf.trim().isEmpty()) {
            return true;
        }
        
        String cleanedFilterCpf = cpf.replaceAll("[^0-9]", "");
        
        String cleanedPatientCpf = patient.getCpf() != null ? 
                                   patient.getCpf().replaceAll("[^0-9]", "") : "";

        return cleanedPatientCpf.equals(cleanedFilterCpf);
    }

    private boolean filterByTelephone(Patient patient, String telephone) {
        if (telephone == null || telephone.trim().isEmpty()) {
            return true;
        }

        String cleanedFilterTelephone = telephone.replaceAll("[^0-9]", "");

        String cleanedPatientTelephone = patient.getTelephone() != null ? 
                                        patient.getTelephone().replaceAll("[^0-9]", "") : "";
        
        return cleanedPatientTelephone.equals(cleanedFilterTelephone);
    }

    private boolean filterByBirthDate(Patient patient, Date birthDate) {
        if (birthDate == null) {
            return true;
        }
        
        Date patientBirthDate = patient.getBirthDate();
        if (patientBirthDate == null) {
            return false;
        }

        Calendar filterCal = Calendar.getInstance();
        filterCal.setTime(birthDate);
        
        Calendar patientCal = Calendar.getInstance();
        patientCal.setTime(patientBirthDate);
        
        return filterCal.get(Calendar.YEAR) == patientCal.get(Calendar.YEAR) &&
               filterCal.get(Calendar.MONTH) == patientCal.get(Calendar.MONTH) &&
               filterCal.get(Calendar.DAY_OF_MONTH) == patientCal.get(Calendar.DAY_OF_MONTH);
    }

    private boolean filterByTreatmentDate(Patient patient, Date treatmentDate) {
        if (treatmentDate == null) {
            return true;
        }
        
        Date patientTreatmentDate = patient.getStartTreatmentDate();
        if (patientTreatmentDate == null) {
            return false;
        }

        Calendar filterCal = Calendar.getInstance();
        filterCal.setTime(treatmentDate);
        
        Calendar patientCal = Calendar.getInstance();
        patientCal.setTime(patientTreatmentDate);
        
        return filterCal.get(Calendar.YEAR) == patientCal.get(Calendar.YEAR) &&
               filterCal.get(Calendar.MONTH) == patientCal.get(Calendar.MONTH) &&
               filterCal.get(Calendar.DAY_OF_MONTH) == patientCal.get(Calendar.DAY_OF_MONTH);
    }
}
