package br.edu.ifsp.sysodonto.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import br.edu.ifsp.sysodonto.exceptions.ConsultationNotFoundException;
import br.edu.ifsp.sysodonto.exceptions.ScheduleConflictException;
import br.edu.ifsp.sysodonto.filters.ConsultationFilter;
import br.edu.ifsp.sysodonto.model.Consultation;
import br.edu.ifsp.sysodonto.model.Patient;
import br.edu.ifsp.sysodonto.service.ConsultationService;
import br.edu.ifsp.sysodonto.service.PatientService;

@Controller
@RequestMapping("/view/consultations")
public class ConsultationController extends SessionChecker {

    @Autowired
    private ConsultationService consultationService;

    @Autowired
    private PatientService patientService;

    @GetMapping
    public ResponseEntity<Map<String, List<Consultation>>> listConsultations(Authentication authentication) throws ExecutionException, InterruptedException {
        try {
            String userId = getLoggedUserId(authentication);

            List<Consultation> consultations =
                    consultationService.getConsultationsByUserId(userId);

            return ResponseEntity.ok().body(Map.of(
                    "consultations", consultations
            ));

        } catch (ExecutionException | InterruptedException e) {
            throw e;
        }
    }

    @GetMapping("/new")
    public String showCreateForm(Model model, Authentication authentication) {
        try {
        	String userId = getLoggedUserId(authentication);

            List<Patient> patients = patientService.getPatientsByUserId(userId);

            model.addAttribute("consultation", new Consultation());
            model.addAttribute("patients", patients);

            return "consultations/form";
        } catch (ExecutionException | InterruptedException e) {
            model.addAttribute("error", "Erro ao carregar pacientes: " + e.getMessage());
            return "consultations/list";
        }
    }

    @PostMapping
    public ResponseEntity<Object> createConsultation(@Validated @RequestBody Consultation consultation,
                                                     Authentication authentication) throws ExecutionException, InterruptedException {

        try {
        	String userId = getLoggedUserId(authentication);

            consultation.setUserId(userId);

            Consultation createdConsultation = consultationService.createConsultation(consultation);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Consulta criada com sucesso!",
                    "consultation", createdConsultation
            ));

        } catch (ScheduleConflictException | ExecutionException | InterruptedException | ConsultationNotFoundException e) {
            throw e;
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultation(@PathVariable("id") String id,
                                                       Authentication authentication) throws ExecutionException, InterruptedException {
        try {
        	String userId = getLoggedUserId(authentication);

            Consultation consultation = consultationService.getConsultationById(id)
                    .orElseThrow(() -> new ConsultationNotFoundException("Consulta não encontrada"));

            if (!consultation.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(consultation);

        } catch (ExecutionException | InterruptedException e) {
            throw e;
        }
    }
    
    @GetMapping("/update/{id}")
    public ResponseEntity<Consultation> getConsultationForUpdate(@PathVariable("id") String id,
                                                                Authentication authentication) {
        try {
        	String userId = getLoggedUserId(authentication);

            Consultation consultation = consultationService.getConsultationById(id)
                    .orElseThrow(() -> new ConsultationNotFoundException("Consulta não encontrada"));

            if (!consultation.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(consultation);

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (ConsultationNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateConsultation(@PathVariable("id") String id,
                                                    @RequestBody Consultation consultation,
                                                    Authentication authentication) throws ExecutionException, InterruptedException {
        try {
        	String userId = getLoggedUserId(authentication);

            Consultation existingConsultation = consultationService.getConsultationById(id)
                    .orElseThrow(() -> new ConsultationNotFoundException("Consulta não encontrada"));

            if (!existingConsultation.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            consultation.setId(id);
            consultation.setUserId(userId);

            Consultation updatedConsultation = consultationService.updateConsultation(id, consultation, true);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Consulta atualizada com sucesso!",
                    "consultation", updatedConsultation
            ));

        } catch (ExecutionException | InterruptedException e) {
            throw e;
        } catch (ConsultationNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", e.getMessage()
            ));
        } catch (ScheduleConflictException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/filter")
    public ResponseEntity<Map<String, List<Consultation>>> filterConsultations(
            @RequestBody ConsultationFilter filter,
            Authentication authentication) throws ExecutionException, InterruptedException {
        try {
        	String userId = getLoggedUserId(authentication);

            List<Consultation> consultations = consultationService.getConsultationsByFilter(userId, filter);

            return ResponseEntity.ok().body(Map.of("consultations", consultations));
        } catch (ExecutionException | InterruptedException e) {
            throw e;
        }
    }

}
