package br.edu.ifsp.sysodonto.service;

import java.util.Random;

public class EmailRecoveryService {

    public static String generateCodeRecoveryEmail() {
        Random random = new Random();
        int code = 1000 + random.nextInt(9000);
        return String.valueOf(code);
    }
}
