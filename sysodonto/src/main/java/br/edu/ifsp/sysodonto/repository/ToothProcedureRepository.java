package br.edu.ifsp.sysodonto.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;

import br.edu.ifsp.sysodonto.model.ToothProcedure;

@Repository
public class ToothProcedureRepository {

    @Autowired
    private Firestore db;

    @Value("${firestore.collection.toothProcedures}")
    private String toothProceduresCollection;

    public ToothProcedure save(ToothProcedure procedure) throws ExecutionException, InterruptedException {
        DocumentReference docRef;
        if (procedure.getId() == null || procedure.getId().isEmpty()) {
            docRef = db.collection(toothProceduresCollection).document();
            procedure.setId(docRef.getId());
        } else {
            docRef = db.collection(toothProceduresCollection).document(procedure.getId());
        }
        
        procedure.setUpdatedAt(new Date());
        ApiFuture<WriteResult> future = docRef.set(procedure);
        future.get();
        return procedure;
    }

    public Optional<ToothProcedure> findById(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(toothProceduresCollection).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        
        if (document.exists()) {
            return Optional.of(document.toObject(ToothProcedure.class));
        }
        return Optional.empty();
    }

    public List<ToothProcedure> findByPatientId(String patientId) throws ExecutionException, InterruptedException {
        CollectionReference procedures = db.collection(toothProceduresCollection);
        Query query = procedures.whereEqualTo("patientId", patientId);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        
        List<ToothProcedure> procedureList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            procedureList.add(document.toObject(ToothProcedure.class));
        }
        return procedureList;
    }

    public List<ToothProcedure> findByPatientIdAndUserId(String patientId, String userId) throws ExecutionException, InterruptedException {
        CollectionReference procedures = db.collection(toothProceduresCollection);
        Query query = procedures
            .whereEqualTo("patientId", patientId)
            .whereEqualTo("userId", userId);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        
        List<ToothProcedure> procedureList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            procedureList.add(document.toObject(ToothProcedure.class));
        }
        return procedureList;
    }

    public List<ToothProcedure> findByPatientIdAndToothNumber(String patientId, int toothNumber) throws ExecutionException, InterruptedException {
        CollectionReference procedures = db.collection(toothProceduresCollection);
        Query query = procedures
            .whereEqualTo("patientId", patientId)
            .whereEqualTo("toothNumber", toothNumber);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        
        List<ToothProcedure> procedureList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            procedureList.add(document.toObject(ToothProcedure.class));
        }
        return procedureList;
    }

    public boolean delete(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(toothProceduresCollection).document(id);
        DocumentSnapshot snapshot = docRef.get().get();
        
        if (!snapshot.exists()) {
            return false;
        }
        
        ApiFuture<WriteResult> future = docRef.delete();
        future.get();
        return true;
    }

    public boolean deleteByPatientId(String patientId) throws ExecutionException, InterruptedException {
        List<ToothProcedure> procedures = findByPatientId(patientId);
        for (ToothProcedure procedure : procedures) {
            delete(procedure.getId());
        }
        return true;
    }
}