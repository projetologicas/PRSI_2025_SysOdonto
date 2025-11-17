package br.edu.ifsp.sysodonto.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import br.edu.ifsp.sysodonto.exceptions.ConsultationNotFoundException;
import br.edu.ifsp.sysodonto.exceptions.ScheduleConflictException;
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
            throw new ScheduleConflictException("Conflito de horário detectado");
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
    
    public List<Consultation> getConsultationsByUserId(String userId) throws ExecutionException, InterruptedException {
        return consultationRepository.findByUserId(userId);
    }

    public Consultation updateConsultation(String id, Consultation consultation, boolean sendReminder) 
            throws ExecutionException, InterruptedException {
        
        if (!consultationRepository.findById(id).isPresent()) {
            throw new ConsultationNotFoundException("Consulta não encontrada");
        }
        
        consultation.setId(id);
        Consultation updatedConsultation = consultationRepository.save(consultation);
        
        return updatedConsultation;
    }

    public boolean deleteConsultation(String id) throws ExecutionException, InterruptedException {
        return consultationRepository.delete(id);
    }

    public boolean hasScheduleConflict(String userId, Date dateTime)
            throws ExecutionException, InterruptedException {

        List<Consultation> existingConsultations =
                consultationRepository.findByUserIdAndDateTime(userId, dateTime);

        return !existingConsultations.isEmpty();
    }
}