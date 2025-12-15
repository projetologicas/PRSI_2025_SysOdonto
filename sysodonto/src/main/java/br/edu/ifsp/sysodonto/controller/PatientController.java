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

import br.edu.ifsp.sysodonto.filters.PatientFilter;
import br.edu.ifsp.sysodonto.model.Patient;
import br.edu.ifsp.sysodonto.service.PatientService;

@Controller
@RequestMapping("/view/patients")
public class PatientController extends SessionChecker {

    @Autowired
    private PatientService patientService;

    @GetMapping
    public ResponseEntity<Map<String, List<Patient>>> listPatients(Authentication authentication) throws ExecutionException, InterruptedException {
        try {
        	String userId = getLoggedUserId(authentication);
        	
            List<Patient> patients = patientService.getPatientsByUserId(userId);

            return ResponseEntity.ok().body(Map.of(
                    "patients", patients
            ));
        } catch (ExecutionException | InterruptedException e) {
            throw e;
        }
    }

    @GetMapping("/findAll")
    public ResponseEntity<Map<String, List<Patient>>> getAllPatients() throws ExecutionException, InterruptedException {
        List<Patient> allPatients = patientService.getAllPatients();
        return ResponseEntity.ok().body(Map.of(
                "patients", allPatients
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatient(@PathVariable("id") String id,
                                              Authentication authentication) throws ExecutionException, InterruptedException {
        try {
        	String userId = getLoggedUserId(authentication);

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
    public ResponseEntity<Object> createPatient(@Validated @RequestBody Patient patient,
                                                Authentication authentication
    ) throws ExecutionException, InterruptedException {

        try {
        	String userId = getLoggedUserId(authentication);

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
        	String userId = getLoggedUserId(authentication);

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

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updatePatient(@PathVariable("id") String id,
                                                @RequestBody Patient patient,
                                                Authentication authentication) throws ExecutionException, InterruptedException {
        try {
        	String userId = getLoggedUserId(authentication);

            Patient existingPatient = patientService.getPatientById(id)
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
            
            if (!existingPatient.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            patient.setId(id);
            patient.setUserId(userId);

            Patient updatedPatient = patientService.updatePatient(id, patient);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Paciente atualizado com sucesso!",
                    "patient", updatedPatient
            ));
        } 
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message", e.getMessage()
            ));
        }
        catch (ExecutionException | InterruptedException e) {
        	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", e.getMessage()
            ));
        } 
    }

    @PostMapping("/filter")
    public ResponseEntity<Map<String, List<Patient>>> filterPatients(
            @RequestBody PatientFilter filter,
            Authentication authentication) throws ExecutionException, InterruptedException {
        try {
        	String userId = getLoggedUserId(authentication);

            List<Patient> patients = patientService.getPatientsByFilter(userId, filter);

            return ResponseEntity.ok().body(Map.of("patients", patients));
        } catch (ExecutionException | InterruptedException e) {
            throw e;
        }
    }
}
