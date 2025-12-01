package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.model.Consultation;
import br.edu.ifsp.sysodonto.model.Patient;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.ConsultationService;
import br.edu.ifsp.sysodonto.service.PatientService;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/view/home")
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
    public ResponseEntity<Map<String, List<Consultation>>> getTodayConsultations(Authentication authentication) 
            throws ExecutionException, InterruptedException {
        
        User loggedUser = (User) authentication.getPrincipal();
        String userId = loggedUser.getId();

        List<Consultation> allConsultations = consultationService.getConsultationsByUserId(userId);

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


        List<Consultation> todayConsultations = allConsultations.stream()
                .filter(c -> c.getDateTime() != null)
                .filter(c -> {
                    Date consultationDate = c.getDateTime();
                    boolean isToday = consultationDate.compareTo(startOfDay) >= 0 && 
                           consultationDate.compareTo(endOfDay) < 0;
                    
                    
                    return isToday;
                })
                .sorted((c1, c2) -> {
                    if (c1.getDateTime() == null || c2.getDateTime() == null) {
                        return 0;
                    }
                    return c1.getDateTime().compareTo(c2.getDateTime());
                })
                .collect(Collectors.toList());


        return ResponseEntity.ok(Map.of("consultations", todayConsultations));
    }
}
