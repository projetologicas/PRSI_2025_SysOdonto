package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.exceptions.CpfAlreadyUsedException;
import br.edu.ifsp.sysodonto.exceptions.InvalidCpfException;
import br.edu.ifsp.sysodonto.exceptions.InvalidTelephoneException;
import br.edu.ifsp.sysodonto.exceptions.TelephoneAlreadyUsedException;
import br.edu.ifsp.sysodonto.model.Patient;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Controller
@RequestMapping("/view/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    public String listPatients(Model model, Authentication authentication) {
        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

            List<Patient> patients = patientService.getPatientsByUserId(userId);

            model.addAttribute("patients", patients);
            return "patients/list";

        } catch (ExecutionException | InterruptedException e) {
            model.addAttribute("error", "Erro ao carregar pacientes: " + e.getMessage());
            return "patients/list";
        }
    }

    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("patient", new Patient());
        return "patients/form";
    }

    @PostMapping
    public ResponseEntity<Object> createPatient(@RequestBody Patient patient,
                                                Authentication authentication
    ) {

        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

            patient.setUserId(userId);

            patientService.createPatient(patient);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Paciente criado com sucesso!"
            ));

        } catch (InvalidCpfException | CpfAlreadyUsedException |
                 InvalidTelephoneException | TelephoneAlreadyUsedException e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Erro na ação solicitada."
            ));

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Erro na ação solicitada."
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Erro na ação solicitada."
            ));
        }
    }

    @GetMapping("/update/{id}")
    public String showEditForm(@PathVariable("id") String id,
                               Model model,
                               Authentication authentication,
                               RedirectAttributes redirectAttributes) {
        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

            Patient patient = patientService.getPatientById(id)
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

            if (!patient.getUserId().equals(userId)) {
                redirectAttributes.addFlashAttribute("error", "Acesso negado.");
                return "redirect:/view/patients";
            }

            model.addAttribute("patient", patient);
            model.addAttribute("isEdit", true);
            return "patients/form";

        } catch (ExecutionException | InterruptedException e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao carregar paciente: " + e.getMessage());
            return "redirect:/view/patients";
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/view/patients";
        }
    }

    @PostMapping("/update/{id}")
    public String updatePatient(@PathVariable("id") String id,
                                @ModelAttribute("patient") Patient patient,
                                Authentication authentication,
                                RedirectAttributes redirectAttributes) {

        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

            Patient existingPatient = patientService.getPatientById(id)
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

            if (!existingPatient.getUserId().equals(userId)) {
                redirectAttributes.addFlashAttribute("error", "Acesso negado.");
                return "redirect:/view/patients";
            }

            patient.setId(id);
            patient.setUserId(userId);

            patientService.updatePatient(id, patient);

            redirectAttributes.addFlashAttribute("success", "Paciente atualizado com sucesso!");
            return "redirect:/view/patients";

        } catch (ExecutionException | InterruptedException e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao atualizar paciente: " + e.getMessage());
            return "redirect:/view/patients/edit/" + id;
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/view/patients";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erro inesperado ao atualizar paciente.");
            return "redirect:/view/patients/edit/" + id;
        }
    }
}
