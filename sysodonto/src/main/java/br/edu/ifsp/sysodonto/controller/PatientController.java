package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.model.Patient;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.PatientService;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<Map<String, List<Patient>>> listPatients(Authentication authentication) throws ExecutionException, InterruptedException {
        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

            List<Patient> patients = patientService.getPatientsByUserId(userId);

            return ResponseEntity.ok().body(Map.of(
                    "patients", patients
            ));
        } catch (ExecutionException | InterruptedException e) {
            throw e;
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatient(@PathVariable("id") String id,
                                             Authentication authentication) throws ExecutionException, InterruptedException {
        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

            Patient patient = patientService.getPatientById(id)
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

            if (!patient.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(patient);
        } catch (ExecutionException | InterruptedException e) {
            throw e;
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
    ) throws ExecutionException, InterruptedException {

        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

            patient.setUserId(userId);

            patientService.createPatient(patient);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Paciente criado com sucesso!"
            ));

        } catch (ExecutionException | InterruptedException e) {
            throw e;
        }
    }

    @GetMapping("/update/{id}")
    public ResponseEntity<Patient> getPatientForUpdate(@PathVariable("id") String id,
                                                       Authentication authentication) {
        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();

            Patient patient = patientService.getPatientById(id)
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

            if (!patient.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(patient);

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
