package br.edu.ifsp.sysodonto.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ifsp.sysodonto.model.Consultation;
import br.edu.ifsp.sysodonto.repository.ConsultationRepository;

@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    public Consultation createConsultation(Consultation consultation, boolean sendReminder) 
            throws ExecutionException, InterruptedException {
        
        if (hasScheduleConflict(consultation.getUserId(), consultation.getDateTime())) {
            throw new IllegalArgumentException("Conflito de horário detectado");
        }
        
        Consultation savedConsultation = consultationRepository.save(consultation);
        
        return savedConsultation;
    }

    public Optional<Consultation> getConsultationById(String id) throws ExecutionException, InterruptedException {
        return consultationRepository.findById(id);
    }

    public List<Consultation> getConsultationsByPatientId(String patientId) throws ExecutionException, InterruptedException {
        return consultationRepository.findByPatientId(patientId);
    }

    public Consultation updateConsultation(String id, Consultation consultation, boolean sendReminder) 
            throws ExecutionException, InterruptedException {
        
        if (!consultationRepository.findById(id).isPresent()) {
            throw new IllegalArgumentException("Consulta não encontrada");
        }
        
        consultation.setId(id);
        Consultation updatedConsultation = consultationRepository.save(consultation);
        
        return updatedConsultation;
    }

    public boolean deleteConsultation(String id) throws ExecutionException, InterruptedException {
        return consultationRepository.delete(id);
    }

    public boolean hasScheduleConflict(String userId, LocalDateTime dateTime) throws ExecutionException, InterruptedException {
        List<Consultation> existingConsultations = consultationRepository.findByUserIdAndDateTime(userId, dateTime);
        return !existingConsultations.isEmpty();
    }
}