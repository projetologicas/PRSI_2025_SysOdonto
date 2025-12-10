package br.edu.ifsp.sysodonto.model;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ToothProcedure {
    private String id;
    private String userId;
    private String patientId;
    private int toothNumber;
    private String toothName;
    private String procedureName;
    private String description;
    private Date procedureDate;
    private Date createdAt;
    private Date updatedAt;

    public ToothProcedure() {}

    public ToothProcedure(String userId, String patientId, int toothNumber, String procedureName, String description, Date procedureDate) {
        this.userId = userId;
        this.patientId = patientId;
        this.toothNumber = toothNumber;
        this.toothName = getToothNameByNumber(toothNumber);
        this.procedureName = procedureName;
        this.description = description;
        this.procedureDate = procedureDate;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    private String getToothNameByNumber(int toothNumber) {
        if (toothNumber == 11) return "Incisivo Central Superior Direito";
        if (toothNumber == 12) return "Incisivo Lateral Superior Direito";
        if (toothNumber == 13) return "Canino Superior Direito";
        if (toothNumber == 14) return "1º Pré-Molar Superior Direito";
        if (toothNumber == 15) return "2º Pré-Molar Superior Direito";
        if (toothNumber == 16) return "1º Molar Superior Direito";
        if (toothNumber == 17) return "2º Molar Superior Direito";
        if (toothNumber == 18) return "3º Molar Superior Direito";
        
        if (toothNumber == 21) return "Incisivo Central Superior Esquerdo";
        if (toothNumber == 22) return "Incisivo Lateral Superior Esquerdo";
        if (toothNumber == 23) return "Canino Superior Esquerdo";
        if (toothNumber == 24) return "1º Pré-Molar Superior Esquerdo";
        if (toothNumber == 25) return "2º Pré-Molar Superior Esquerdo";
        if (toothNumber == 26) return "1º Molar Superior Esquerdo";
        if (toothNumber == 27) return "2º Molar Superior Esquerdo";
        if (toothNumber == 28) return "3º Molar Superior Esquerdo";
        
        if (toothNumber == 31) return "Incisivo Central Inferior Direito";
        if (toothNumber == 32) return "Incisivo Lateral Inferior Direito";
        if (toothNumber == 33) return "Canino Inferior Direito";
        if (toothNumber == 34) return "1º Pré-Molar Inferior Direito";
        if (toothNumber == 35) return "2º Pré-Molar Inferior Direito";
        if (toothNumber == 36) return "1º Molar Inferior Direito";
        if (toothNumber == 37) return "2º Molar Inferior Direito";
        if (toothNumber == 38) return "3º Molar Inferior Direito";
        
        if (toothNumber == 41) return "Incisivo Central Inferior Esquerdo";
        if (toothNumber == 42) return "Incisivo Lateral Inferior Esquerdo";
        if (toothNumber == 43) return "Canino Inferior Esquerdo";
        if (toothNumber == 44) return "1º Pré-Molar Inferior Esquerdo";
        if (toothNumber == 45) return "2º Pré-Molar Inferior Esquerdo";
        if (toothNumber == 46) return "1º Molar Inferior Esquerdo";
        if (toothNumber == 47) return "2º Molar Inferior Esquerdo";
        if (toothNumber == 48) return "3º Molar Inferior Esquerdo";
        
        return "Dente " + toothNumber;
    }
}