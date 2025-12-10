package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.dto.ToothProcedureRequest;
import br.edu.ifsp.sysodonto.exceptions.ToothProcedureNotFoundException;
import br.edu.ifsp.sysodonto.model.ToothProcedure;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.ToothProcedureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/view/tooth-procedures")
public class ToothProcedureController {

    @Autowired
    private ToothProcedureService toothProcedureService;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Map<String, List<ToothProcedure>>> getProceduresByPatient(
            @PathVariable String patientId,
            Authentication authentication) throws ExecutionException, InterruptedException {
        
        User loggedUser = (User) authentication.getPrincipal();
        String userId = loggedUser.getId();
        
        List<ToothProcedure> procedures = toothProcedureService.getProceduresByPatientIdAndUserId(patientId, userId);
        
        return ResponseEntity.ok(Map.of("procedures", procedures));
    }

    @GetMapping("/patient/{patientId}/tooth/{toothNumber}")
    public ResponseEntity<Map<String, List<ToothProcedure>>> getProceduresByPatientAndTooth(
            @PathVariable String patientId,
            @PathVariable int toothNumber,
            Authentication authentication) throws ExecutionException, InterruptedException {
        
        User loggedUser = (User) authentication.getPrincipal();
        String userId = loggedUser.getId();
        
        List<ToothProcedure> procedures = toothProcedureService.getProceduresByPatientIdAndToothNumber(patientId, toothNumber);
        
        return ResponseEntity.ok(Map.of("procedures", procedures));
    }

    @PostMapping("/patient/{patientId}")
    public ResponseEntity<?> createProcedure(
            @PathVariable String patientId,
            @RequestBody ToothProcedureRequest request,
            Authentication authentication) throws ExecutionException, InterruptedException {
        
        User loggedUser = (User) authentication.getPrincipal();
        String userId = loggedUser.getId();
        
        ToothProcedure procedure = toothProcedureService.createToothProcedure(
            userId, patientId, request.getToothNumber(), 
            request.getProcedureName(), request.getDescription(), request.getProcedureDate()
        );
        
        return ResponseEntity.ok(Map.of(
            "message", "Procedimento cadastrado com sucesso!",
            "procedure", procedure
        ));
    }

    @PutMapping("/{procedureId}")
    public ResponseEntity<?> updateProcedure(
            @PathVariable String procedureId,
            @RequestBody ToothProcedureRequest request,
            Authentication authentication) throws ExecutionException, InterruptedException {
        
        try {
            ToothProcedure procedure = toothProcedureService.updateToothProcedure(
                procedureId, request.getProcedureName(), request.getDescription(), request.getProcedureDate()
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "Procedimento atualizado com sucesso!",
                "procedure", procedure
            ));
            
        } catch (ToothProcedureNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{procedureId}")
    public ResponseEntity<?> deleteProcedure(
            @PathVariable String procedureId,
            Authentication authentication) throws ExecutionException, InterruptedException {
        
        try {
            boolean deleted = toothProcedureService.deleteProcedure(procedureId);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Procedimento excluído com sucesso!"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Procedimento não encontrado"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao excluir procedimento"));
        }
    }
}