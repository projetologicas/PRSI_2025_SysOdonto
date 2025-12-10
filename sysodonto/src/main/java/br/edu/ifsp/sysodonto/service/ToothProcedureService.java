package br.edu.ifsp.sysodonto.service;

import br.edu.ifsp.sysodonto.exceptions.ToothProcedureNotFoundException;
import br.edu.ifsp.sysodonto.model.ToothProcedure;
import br.edu.ifsp.sysodonto.repository.ToothProcedureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ToothProcedureService {

    @Autowired
    private ToothProcedureRepository toothProcedureRepository;

    public ToothProcedure createToothProcedure(String userId, String patientId, int toothNumber, 
                                              String procedureName, String description, Date procedureDate) 
            throws ExecutionException, InterruptedException {
        
        ToothProcedure procedure = new ToothProcedure(userId, patientId, toothNumber, procedureName, description, procedureDate);
        return toothProcedureRepository.save(procedure);
    }

    public ToothProcedure updateToothProcedure(String id, String procedureName, String description, Date procedureDate) 
            throws ExecutionException, InterruptedException {
        
        ToothProcedure procedure = toothProcedureRepository.findById(id)
                .orElseThrow(() -> new ToothProcedureNotFoundException("Procedimento não encontrado"));
        
        procedure.setProcedureName(procedureName);
        procedure.setDescription(description);
        procedure.setProcedureDate(procedureDate);
        procedure.setUpdatedAt(new Date());
        
        return toothProcedureRepository.save(procedure);
    }

    public List<ToothProcedure> getProceduresByPatientId(String patientId) throws ExecutionException, InterruptedException {
        return toothProcedureRepository.findByPatientId(patientId);
    }

    public List<ToothProcedure> getProceduresByPatientIdAndUserId(String patientId, String userId) 
            throws ExecutionException, InterruptedException {
        return toothProcedureRepository.findByPatientIdAndUserId(patientId, userId);
    }

    public List<ToothProcedure> getProceduresByPatientIdAndToothNumber(String patientId, int toothNumber) 
            throws ExecutionException, InterruptedException {
        return toothProcedureRepository.findByPatientIdAndToothNumber(patientId, toothNumber);
    }

    public ToothProcedure getProcedureById(String id) throws ExecutionException, InterruptedException {
        return toothProcedureRepository.findById(id)
                .orElseThrow(() -> new ToothProcedureNotFoundException("Procedimento não encontrado"));
    }

    public boolean deleteProcedure(String id) throws ExecutionException, InterruptedException {
        return toothProcedureRepository.delete(id);
    }

    public boolean deleteProceduresByPatientId(String patientId) throws ExecutionException, InterruptedException {
        return toothProcedureRepository.deleteByPatientId(patientId);
    }
}