package br.edu.ifsp.sysodonto.repository;

import br.edu.ifsp.sysodonto.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

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
}
