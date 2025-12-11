package br.edu.ifsp.sysodonto.service;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.auth.InvalidCredentialsException;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import br.edu.ifsp.sysodonto.model.Consultation;
import br.edu.ifsp.sysodonto.model.Patient;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class WhatsAppBotService implements Runnable {
	
	private String userId;
	
	@Autowired
	private ConsultationService consultationService;
	
	@Autowired
	private PatientService patientService;
	
	private final String xpathSearchBox = "/html/body/div[1]/div/div/div/div/div[3]/div/div[4]/div/div[1]/div/div[2]/div/div/div[1]";
	private final String xpathPatientBox = "/html/body/div[1]/div/div/div/div/div[3]/div/div[4]/div/div[3]/div[1]/div/div/div[2]/div/div/div/div[2]";
	private final String xpathMessageInput = "/html/body/div[1]/div/div/div/div/div[3]/div/div[5]/div/footer/div[1]/div/span/div/div/div/div[3]/div/p";
	private final String xpathSendMessageButton = "/html/body/div[1]/div/div/div/div/div[3]/div/div[5]/div/footer/div[1]/div/span/div/div/div/div[4]/div/span/button";
	
	@Override
	public void run() {
		sendMessages();
	}

	private void sendMessages() {
		try {
			List<Consultation> consultations = consultationService.getTomorrowConsultations(userId);
			
			List<Consultation> consultationsToRemind = new ArrayList<Consultation>();
			List<Patient> patientsToRemind = new ArrayList<Patient>();
			
			
			if (! CollectionUtils.isEmpty(consultations)) {
				for (Consultation c : consultations) {
					if (c.isSendReminder()) {
						Patient patient = patientService.getPatientById(c.getPatientId()).get();
						patientsToRemind.add(patient);
						consultationsToRemind.add(c);
					}
				}
				
				ChromeOptions options = new ChromeOptions();
				WebDriver driver = new ChromeDriver(options);
				driver.get("https://web.whatsapp.com/");
				
				WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(120));
				WebElement searchBox = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(xpathSearchBox)));
				
				for (int i = 0; i < consultationsToRemind.size(); i++) {
					Consultation consultation = consultationsToRemind.get(i);
					Patient patient = patientsToRemind.get(i);

					try {
						wait.until(ExpectedConditions.elementToBeClickable(searchBox));
						searchBox.click();
						pause(500);
						
						searchBox.sendKeys(Keys.CONTROL + "a"); 
						searchBox.sendKeys(Keys.DELETE);
						pause(500);
										
						typeHumanLike(searchBox, patient.getTelephone());
					    pause(2000); 

					    WebElement patientBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(xpathPatientBox)));
					    patientBox.click();
					    
					    pause(1500);

					    WebElement messageInput = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(xpathMessageInput)));
					    messageInput.click();
					    pause(300);

					    String reminder = createReminderFor(patient, consultation);
					    
					    messageInput.sendKeys(reminder);
					    
					    WebElement sendButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(xpathSendMessageButton)));
					    sendButton.click();

					    pause(2000);
					}
					catch (Exception e) {
						log.error("Error sending reminder to " + patient.getName() + ".", e);
					}
				}				
			}
			
		}
		catch(Throwable t ) {
			log.error("Error loading chrome driver.", t);
		}
	}
	
	private String createReminderFor(Patient patient, Consultation consultation) {
		SimpleDateFormat sdfDate = new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sdfTime = new SimpleDateFormat("HH:mm");
		
		String date = sdfDate.format(consultation.getDateTime());
		String time = sdfTime.format(consultation.getDateTime());
		
		StringBuilder message = new StringBuilder();
		message.append("Olá, " + patient.getName() + ". ");
		message.append("Você possui uma consulta no dia " + date + " às " + time + ". ");
		message.append("Posso confirmar sua presença?");
		
		return message.toString();
	}
	
	private void pause(long millis) {
	    try {
	        Thread.sleep(millis);
	    } catch (InterruptedException e) {
	        Thread.currentThread().interrupt();
	    }
	}
	
	private void typeHumanLike(WebElement element, String text) {
	    for (char c : text.toCharArray()) {
	        element.sendKeys(String.valueOf(c));
	        pause(50 + (long)(Math.random() * 100));
	    }
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) throws InvalidCredentialsException {
		if (userId == null || userId.isBlank()) {
			throw new InvalidCredentialsException();
		}
		
		this.userId = userId;
	}
}
