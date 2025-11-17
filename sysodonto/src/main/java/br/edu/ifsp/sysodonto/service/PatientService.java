package br.edu.ifsp.sysodonto.service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import br.edu.ifsp.sysodonto.exceptions.*;
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
}
