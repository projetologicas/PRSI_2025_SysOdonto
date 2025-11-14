package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.exceptions.ScheduleConflictException;
import br.edu.ifsp.sysodonto.model.Consultation;
import br.edu.ifsp.sysodonto.model.Patient;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.ConsultationService;
import br.edu.ifsp.sysodonto.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Controller
@RequestMapping("/view/consultations")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @Autowired
    private PatientService patientService;

    @GetMapping
    public String listConsultations(Model model, Authentication authentication) {
        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

            List<Consultation> consultations =
                    consultationService.getConsultationsByUserId(userId);

            model.addAttribute("consultations", consultations);
            return "consultations/list";

        } catch (ExecutionException | InterruptedException e) {
            model.addAttribute("error", "Erro ao carregar consultas: " + e.getMessage());
            return "consultations/list";
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
    public String createConsultation(@ModelAttribute("consultation") Consultation consultation,
                                     Authentication authentication,
                                     RedirectAttributes redirectAttributes) {

        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

            consultation.setUserId(userId);

            Patient patient = patientService.getPatientById(consultation.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

            consultation.setPatientName(patient.getName());

            consultationService.createConsultation(consultation, false);

            redirectAttributes.addFlashAttribute("success", "Consulta cadastrada com sucesso!");
            return "redirect:/view/consultations";

        } catch (ScheduleConflictException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/view/consultations/new";

        } catch (ExecutionException | InterruptedException e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao salvar consulta: " + e.getMessage());
            return "redirect:/view/consultations/new";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erro inesperado ao salvar consulta.");
            return "redirect:/view/consultations/new";
        }
    }
    
}
