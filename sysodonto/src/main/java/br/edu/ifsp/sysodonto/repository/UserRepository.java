package br.edu.ifsp.sysodonto.repository;

import br.edu.ifsp.sysodonto.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
public class UserRepository {

    @Autowired
    private Firestore db;

    @Value("${firestore.collection.users}")
    private String usersCollection;

    public User createUser(User user) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(usersCollection).document();
        user.setId(docRef.getId());
        ApiFuture<WriteResult> future = docRef.set(user);
        future.get();
        return user;
    }
    
    public User save(User user) throws ExecutionException, InterruptedException {
        DocumentReference docRef;
        if (user.getId() == null || user.getId().isEmpty()) {
            docRef = db.collection(usersCollection).document();
            user.setId(docRef.getId());
        } else {
            docRef = db.collection(usersCollection).document(user.getId());
        }
        
        ApiFuture<WriteResult> future = docRef.set(user);
        future.get();
        return user;
    }
    
    public Optional<User> findById(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = db.collection(usersCollection).document(id);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        
        if (document.exists()) {
            return Optional.of(document.toObject(User.class));
        }
        return Optional.empty();
    }
    
    public Optional<User> findByEmail(String email) throws ExecutionException, InterruptedException {
        CollectionReference users = db.collection(usersCollection);
        Query query = users.whereEqualTo("email", email);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot = future.get();
        
        if (!querySnapshot.isEmpty()) {
            return Optional.of(querySnapshot.getDocuments().get(0).toObject(User.class));
        }
        return Optional.empty();
    }
    
    public List<User> findAll() throws ExecutionException, InterruptedException {
        CollectionReference users = db.collection(usersCollection);
        ApiFuture<QuerySnapshot> future = users.get();
        QuerySnapshot querySnapshot = future.get();
        
        List<User> userList = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            userList.add(document.toObject(User.class));
        }
        return userList;
    }
    
    public boolean delete(String id) throws ExecutionException, InterruptedException {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("ID não pode ser nulo ou vazio");
        }

        DocumentReference docRef = db.collection(usersCollection).document(id);
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
