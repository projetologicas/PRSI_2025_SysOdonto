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
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;

import br.edu.ifsp.sysodonto.model.Consultation;

@Repository
public class ConsultationRepository {

    @Autowired
    private Firestore db;

    @Value("${firestore.collection.consultations}")
    private String consultationsCollection;
    
    public Consultation createConsultation(Consultation consultation) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(consultationsCollection).document();
        consultation.setId(docRef.getId());
        ApiFuture<WriteResult> future = docRef.set(consultation);
        future.get();
        return consultation;
    }

    public Consultation save(Consultation consultation) throws ExecutionException, InterruptedException {
        DocumentReference docRef;
        
        if (consultation.getId() == null || consultation.getId().isEmpty()) {
            docRef = db.collection(consultationsCollection).document();
            consultation.setId(docRef.getId());
        } else {
            docRef = db.collection(consultationsCollection).document(consultation.getId());
        }
        
        ApiFuture<WriteResult> future = docRef.set(consultation);
        future.get();
        return consultation;
    }

    public Optional<Consultation> findById(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(consultationsCollection).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        
        if (document.exists()) {
            return Optional.of(document.toObject(Consultation.class));
        }
        return Optional.empty();
    }
    
    public List<Consultation> findByUserId(String userId) throws ExecutionException, InterruptedException {
        CollectionReference consultations = db.collection(consultationsCollection);
        Query query = consultations.whereEqualTo("userId", userId);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        
        List<Consultation> consultationList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            consultationList.add(document.toObject(Consultation.class));
        }
        return consultationList;
    }

    public List<Consultation> findByPatientId(String patientId) throws ExecutionException, InterruptedException {
        CollectionReference consultations = db.collection(consultationsCollection);
        Query query = consultations.whereEqualTo("patientId", patientId);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        
        List<Consultation> consultationList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            consultationList.add(document.toObject(Consultation.class));
        }
        return consultationList;
    }

    public List<Consultation> findByUserIdAndDateTime(String userId, Date dateTime)
            throws ExecutionException, InterruptedException {

        CollectionReference consultations = db.collection(consultationsCollection);
        Query query = consultations
                .whereEqualTo("userId", userId)
                .whereEqualTo("dateTime", dateTime);

        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();

        List<Consultation> consultationList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            consultationList.add(document.toObject(Consultation.class));
        }
        return consultationList;
    }

    public List<Consultation> findAll() throws ExecutionException, InterruptedException {
        CollectionReference consultations = db.collection(consultationsCollection);
        ApiFuture<QuerySnapshot> future = consultations.get();
        QuerySnapshot querySnapshot = future.get();
        
        List<Consultation> consultationList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            consultationList.add(document.toObject(Consultation.class));
        }
        return consultationList;
    }

    public boolean delete(String id) throws ExecutionException, InterruptedException {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("ID não pode ser nulo ou vazio");
        }

        DocumentReference docRef = db.collection(consultationsCollection).document(id);
        DocumentSnapshot snapshot = docRef.get().get();
        
        if (!snapshot.exists()) {
            throw new IllegalArgumentException("Documento com ID " + id + " não encontrado");
        }
        
        ApiFuture<WriteResult> future = docRef.delete();
        WriteResult result = future.get();
        
        System.out.println("Documento deletado em: " + result.getUpdateTime());
        return true;
    }
    
    public List<Consultation> findInTimeRange(String dentistId, Date start, Date end) throws Throwable {
    	ApiFuture<QuerySnapshot> future = db.collection(consultationsCollection)
    			.whereEqualTo("userId", dentistId)
    			.whereGreaterThanOrEqualTo("dateTime", start)
    			.whereLessThanOrEqualTo("dateTime", end)
    			.get();
    	
    	List<Consultation> consultations = new ArrayList<Consultation>();
    	List<QueryDocumentSnapshot> documents = future.get().getDocuments();
    	
    	for (QueryDocumentSnapshot document : documents) {
    		Consultation c = document.toObject(Consultation.class);
    		consultations.add(c);
    	}
    	
    	return consultations;
    }
    
}
