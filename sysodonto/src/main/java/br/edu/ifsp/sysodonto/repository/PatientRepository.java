package br.edu.ifsp.sysodonto.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Value;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;

import br.edu.ifsp.sysodonto.model.Patient;

@Repository
public class PatientRepository {

    @Autowired
    private Firestore db;

    @Value("${firestore.collection.patients}")
    private String patientsCollection;
    
    public Patient createPatient(Patient patient) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(patientsCollection).document();
        patient.setId(docRef.getId());
        ApiFuture<WriteResult> future = docRef.set(patient);
        future.get();
        return patient;
    }

    public Patient save(Patient patient) throws ExecutionException, InterruptedException {
        DocumentReference docRef;
        if (patient.getId() == null || patient.getId().isEmpty()) {
            docRef = db.collection(patientsCollection).document();
            patient.setId(docRef.getId());
        } else {
            docRef = db.collection(patientsCollection).document(patient.getId());
        }
        
        ApiFuture<WriteResult> future = docRef.set(patient);
        future.get();
        return patient;
    }

    public Optional<Patient> findById(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(patientsCollection).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        
        if (document.exists()) {
            return Optional.of(document.toObject(Patient.class));
        }
        return Optional.empty();
    }
    
    public List<Patient> findByUserId(String userId) throws ExecutionException, InterruptedException {
        CollectionReference patients = db.collection(patientsCollection);
        Query query = patients.whereEqualTo("userId", userId);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        
        List<Patient> patientList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            patientList.add(document.toObject(Patient.class));
        }
        return patientList;
    }

    public Optional<Patient> findByTelephone(String telephone) throws ExecutionException, InterruptedException {
        CollectionReference patients = db.collection(patientsCollection);
        Query query = patients.whereEqualTo("telephone", telephone);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        
        if (!querySnapshot.isEmpty()) {
            return Optional.of(querySnapshot.getDocuments().get(0).toObject(Patient.class));
        }
        return Optional.empty();
    }
    
    public Optional<Patient> findByCpf(String cpf) throws ExecutionException, InterruptedException {
        CollectionReference patients = db.collection(patientsCollection);
        Query query = patients.whereEqualTo("cpf", cpf);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        
        if (!querySnapshot.isEmpty()) {
            return Optional.of(querySnapshot.getDocuments().get(0).toObject(Patient.class));
        }
        return Optional.empty();
    }

    public List<Patient> findAll() throws ExecutionException, InterruptedException {
        CollectionReference patients = db.collection(patientsCollection);
        ApiFuture<QuerySnapshot> future = patients.get();
        QuerySnapshot querySnapshot = future.get();
        
        List<Patient> patientList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            patientList.add(document.toObject(Patient.class));
        }
        return patientList;
    }

    public boolean delete(String id) throws ExecutionException, InterruptedException {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("ID não pode ser nulo ou vazio");
        }

        DocumentReference docRef = db.collection(patientsCollection).document(id);
        DocumentSnapshot snapshot = docRef.get().get();
        
        if (!snapshot.exists()) {
            throw new IllegalArgumentException("Documento com ID " + id + " não encontrado");
        }
        
        ApiFuture<WriteResult> future = docRef.delete();
        WriteResult result = future.get();
        
        System.out.println("Documento deletado em: " + result.getUpdateTime());
        return true;
    }
}
