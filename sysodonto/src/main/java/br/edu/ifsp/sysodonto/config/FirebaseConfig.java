package br.edu.ifsp.sysodonto.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;

@Configuration
public class FirebaseConfig {

    @Bean
    public Firestore firestore() {

        try {
            String caminhoCredenciais = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");

            if (caminhoCredenciais == null) {
                throw new RuntimeException("A variável GOOGLE_APPLICATION_CREDENTIALS não está configurada no sistema.");
            }

            FileInputStream serviceAccount = new FileInputStream(caminhoCredenciais);

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("🔥 Firebase inicializado (usando JSON externo)!");
            }

            return FirestoreClient.getFirestore();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao inicializar Firebase: " + e.getMessage(), e);
        }
    }
}
