package br.edu.ifsp.sysodonto.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.sysodonto.model.Consultation;
import br.edu.ifsp.sysodonto.model.Patient;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.ConsultationService;
import br.edu.ifsp.sysodonto.service.PatientService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/view/home")
@Slf4j
public class HomeController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private ConsultationService consultationService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getHomeStats(Authentication authentication) 
            throws ExecutionException, InterruptedException {
        
        User loggedUser = (User) authentication.getPrincipal();
        String userId = loggedUser.getId();

        List<Patient> patients = patientService.getPatientsByUserId(userId);
        int totalPatients = patients.size();

        List<Consultation> consultations = consultationService.getConsultationsByUserId(userId);
        int totalConsultations = consultations.size();

        Calendar today = Calendar.getInstance();
        today.set(Calendar.HOUR_OF_DAY, 0);
        today.set(Calendar.MINUTE, 0);
        today.set(Calendar.SECOND, 0);
        today.set(Calendar.MILLISECOND, 0);
        
        Calendar tomorrow = Calendar.getInstance();
        tomorrow.setTime(today.getTime());
        tomorrow.add(Calendar.DATE, 1);

        Date startOfDay = today.getTime();
        Date endOfDay = tomorrow.getTime();

        long todayConsultations = consultations.stream()
                .filter(c -> c.getDateTime() != null)
                .filter(c -> {
                    Date consultationDate = c.getDateTime();
                    return consultationDate.compareTo(startOfDay) >= 0 && 
                           consultationDate.compareTo(endOfDay) < 0;
                })
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", totalPatients);
        stats.put("totalConsultations", totalConsultations);
        stats.put("todayConsultations", todayConsultations);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/consultations/today")
    public ResponseEntity<Map<String, List<Consultation>>> getTodayConsultations(Authentication authentication)  throws ExecutionException {
    	try {
    		User loggedUser = (User) authentication.getPrincipal();
    		String userId = loggedUser.getId();    	
    		List<Consultation> todaysConsultations = consultationService.getTodaysConsultations(userId);
    		return ResponseEntity.ok(Map.of("consultations", todaysConsultations));
    	}
    	catch(Throwable t) {
    		log.error("Error getting today's consultations.", t);
    		return ResponseEntity.internalServerError().body(null);
    	}
    }
}
