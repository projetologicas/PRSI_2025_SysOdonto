package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.exceptions.ConsultationNotFoundException;
import br.edu.ifsp.sysodonto.exceptions.ScheduleConflictException;
import br.edu.ifsp.sysodonto.model.Consultation;
import br.edu.ifsp.sysodonto.model.Patient;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.ConsultationService;
import br.edu.ifsp.sysodonto.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Controller
@RequestMapping("/view/consultations")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @Autowired
    private PatientService patientService;

    @GetMapping
    public ResponseEntity<Map<String, List<Consultation>>> listConsultations(Authentication authentication) throws ExecutionException, InterruptedException {
        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

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
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

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
    public ResponseEntity<Object> createConsultation(@RequestBody Consultation consultation,
                                                     Authentication authentication) throws ExecutionException, InterruptedException {

        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

            consultation.setUserId(userId);

            consultationService.createConsultation(consultation, false);

            return ResponseEntity.ok().body(Map.of(
                    "consultations", consultation
            ));

        } catch (ScheduleConflictException | ExecutionException | InterruptedException |
                 ConsultationNotFoundException e) {
            throw e;
        }
    }

}
