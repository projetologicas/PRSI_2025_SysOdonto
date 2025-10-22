package br.edu.ifsp.sysodonto.config;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirebaseConfig {
    @Bean
    public Firestore firestore() {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp();
        }

        return FirestoreClient.getFirestore();
    }
}
