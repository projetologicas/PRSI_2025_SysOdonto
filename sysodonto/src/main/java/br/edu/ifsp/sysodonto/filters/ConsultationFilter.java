package br.edu.ifsp.sysodonto.filters;

import java.util.Date;

public class ConsultationFilter {
    private String patientName;
    private Date startDate;
    private Date endDate;
    private Date startTime;
    private Date endTime;

    public ConsultationFilter() {}

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public boolean isEmpty() {
        return (patientName == null || patientName.trim().isEmpty()) &&
               startDate == null &&
               endDate == null &&
               startTime == null &&
               endTime == null;
    }
}