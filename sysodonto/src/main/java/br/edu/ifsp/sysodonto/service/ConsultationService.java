package br.edu.ifsp.sysodonto.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import br.edu.ifsp.sysodonto.exceptions.ConsultationNotFoundException;
import br.edu.ifsp.sysodonto.exceptions.ScheduleConflictException;
import br.edu.ifsp.sysodonto.filters.ConsultationFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ifsp.sysodonto.model.Consultation;
import br.edu.ifsp.sysodonto.repository.ConsultationRepository;

@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    public Consultation createConsultation(Consultation consultation) 
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
    
    public List<Consultation> getConsultationsByFilter(String userId, ConsultationFilter filter) 
            throws ExecutionException, InterruptedException {
        
        List<Consultation> consultations = getConsultationsByUserId(userId);
        
        if (filter.isEmpty()) {
            return consultations;
        }

        return consultations.stream()
                .filter(consultation -> filterByPatientName(consultation, filter.getPatientName()))
                .filter(consultation -> filterByDateRange(consultation, filter.getStartDate(), filter.getEndDate()))
                .filter(consultation -> filterByTimeRange(consultation, filter.getStartTime(), filter.getEndTime()))
                .collect(Collectors.toList());
    }

    private boolean filterByPatientName(Consultation consultation, String patientName) {
        if (patientName == null || patientName.trim().isEmpty()) {
            return true;
        }
        return consultation.getPatientName() != null && 
               consultation.getPatientName().toLowerCase().contains(patientName.toLowerCase());
    }

    private boolean filterByDateRange(Consultation consultation, Date startDate, Date endDate) {
        if (startDate == null && endDate == null) {
            return true;
        }
        
        Date consultationDate = consultation.getDateTime();
        if (consultationDate == null) {
            return false;
        }

        Calendar consultationCal = Calendar.getInstance();
        consultationCal.setTime(consultationDate);
        
        Calendar startCal = Calendar.getInstance();
        if (startDate != null) {
            startCal.setTime(startDate);
            startCal.set(Calendar.HOUR_OF_DAY, 0);
            startCal.set(Calendar.MINUTE, 0);
            startCal.set(Calendar.SECOND, 0);
            startCal.set(Calendar.MILLISECOND, 0);
        }
        
        Calendar endCal = Calendar.getInstance();
        if (endDate != null) {
            endCal.setTime(endDate);
            endCal.set(Calendar.HOUR_OF_DAY, 23);
            endCal.set(Calendar.MINUTE, 59);
            endCal.set(Calendar.SECOND, 59);
            endCal.set(Calendar.MILLISECOND, 999);
        }

        boolean afterStart = startDate == null || 
                           !consultationCal.getTime().before(startCal.getTime());
        
        boolean beforeEnd = endDate == null || 
                          !consultationCal.getTime().after(endCal.getTime());
        
        return afterStart && beforeEnd;
    }

    private boolean filterByTimeRange(Consultation consultation, Date startTime, Date endTime) {
        if (startTime == null && endTime == null) {
            return true;
        }
        
        Date consultationDateTime = consultation.getDateTime();
        if (consultationDateTime == null) {
            return false;
        }

        Calendar consultationCal = Calendar.getInstance();
        consultationCal.setTime(consultationDateTime);
        
        int consultationHour = consultationCal.get(Calendar.HOUR_OF_DAY);
        int consultationMinute = consultationCal.get(Calendar.MINUTE);
        
        int startHour = 0;
        int startMinute = 0;
        if (startTime != null) {
            Calendar startTimeCal = Calendar.getInstance();
            startTimeCal.setTime(startTime);
            startHour = startTimeCal.get(Calendar.HOUR_OF_DAY);
            startMinute = startTimeCal.get(Calendar.MINUTE);
        }
        
        int endHour = 23;
        int endMinute = 59;
        if (endTime != null) {
            Calendar endTimeCal = Calendar.getInstance();
            endTimeCal.setTime(endTime);
            endHour = endTimeCal.get(Calendar.HOUR_OF_DAY);
            endMinute = endTimeCal.get(Calendar.MINUTE);
        }
        
        int consultationTotalMinutes = consultationHour * 60 + consultationMinute;
        int startTotalMinutes = startHour * 60 + startMinute;
        int endTotalMinutes = endHour * 60 + endMinute;

        boolean afterStartTime = startTime == null || consultationTotalMinutes >= startTotalMinutes;
        boolean beforeEndTime = endTime == null || consultationTotalMinutes <= endTotalMinutes;
        
        return afterStartTime && beforeEndTime;
    }
    
    public List<Consultation> getTomorrowConsultations(String userId) throws Throwable {
    	LocalDateTime startOfDay = LocalDate.now().plusDays(1).atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().plusDays(1).atTime(LocalTime.MAX);

        Date startDate = Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());
        
		List<Consultation> consultations = consultationRepository.findInTimeRange(userId, startDate, endDate);
		return consultations;
    }
    
}