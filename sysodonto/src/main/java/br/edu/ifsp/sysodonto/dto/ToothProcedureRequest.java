package br.edu.ifsp.sysodonto.dto;

import lombok.Data;
import java.util.Date;

@Data
public class ToothProcedureRequest {
    private int toothNumber;
    private String procedureName;
    private String description;
    private Date procedureDate;
}