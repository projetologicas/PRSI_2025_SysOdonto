package br.edu.ifsp.sysodonto.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.google.api.client.util.Value;
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
    
    public ToothProcedure createToothProcedure(ToothProcedure toothProcedure) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(toothProceduresCollection).document();
        toothProcedure.setProcedureId(docRef.getId());
        ApiFuture<WriteResult> future = docRef.set(toothProcedure);
        future.get();
        return toothProcedure;
    }

    public ToothProcedure save(ToothProcedure procedure) throws ExecutionException, InterruptedException {
        DocumentReference docRef;
        if (procedure.getProcedureId() == null || procedure.getProcedureId().isEmpty()) {
            docRef = db.collection(toothProceduresCollection).document();
            procedure.setProcedureId(docRef.getId());
        } else {
            docRef = db.collection(toothProceduresCollection).document(procedure.getProcedureId());
        }
        
        ApiFuture<WriteResult> future = docRef.set(procedure);
        future.get();
        return procedure;
    }

    public Optional<ToothProcedure> findById(String procedureId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(toothProceduresCollection).document(procedureId);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        
        if (document.exists()) {
            return Optional.of(document.toObject(ToothProcedure.class));
        }
        return Optional.empty();
    }

    public List<ToothProcedure> findByToothId(int toothId) throws ExecutionException, InterruptedException {
        CollectionReference procedures = db.collection(toothProceduresCollection);
        Query query = procedures.whereEqualTo("toothId", toothId);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        
        List<ToothProcedure> procedureList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            procedureList.add(document.toObject(ToothProcedure.class));
        }
        return procedureList;
    }

    public boolean delete(String procedureId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(toothProceduresCollection).document(procedureId);
        DocumentSnapshot snapshot = docRef.get().get();
        
        if (!snapshot.exists()) {
            return false;
        }
        
        ApiFuture<WriteResult> future = docRef.delete();
        future.get();
        return true;
    }
}
