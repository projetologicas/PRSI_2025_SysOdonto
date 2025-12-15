package br.edu.ifsp.sysodonto.service;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.List;
import java.util.Locale;

import org.apache.http.auth.InvalidCredentialsException;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchSessionException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
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
	
	@Autowired
	private MessageSource messageSource;
	
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
			
			if (! CollectionUtils.isEmpty(consultations)) {
				ChromeOptions options = new ChromeOptions();
				WebDriver driver = new ChromeDriver(options);
				driver.get("https://web.whatsapp.com/");
				
				WebDriverWait longWait = new WebDriverWait(driver, Duration.ofSeconds(120));
				WebDriverWait shortWait = new WebDriverWait(driver, Duration.ofSeconds(15));
				
				WebElement searchBox = longWait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(xpathSearchBox)));
				
				for (int i = 0; i < consultations.size(); i++) {
					Consultation consultation = consultations.get(i);
					Patient patient = patientService.getPatientById(consultation.getPatientId()).orElse(null);
					
					if (patient == null) continue;

					try {
						longWait.until(ExpectedConditions.elementToBeClickable(searchBox));
						searchBox.click();
						pause(500);
						
						searchBox.sendKeys(Keys.CONTROL + "a"); 
						searchBox.sendKeys(Keys.DELETE);
						pause(500);
										
						typeHumanLike(searchBox, patient.getTelephone());
					    pause(2000); 

					    WebElement patientBox = shortWait.until(ExpectedConditions.elementToBeClickable(By.xpath(xpathPatientBox)));
					    patientBox.click();
					    
					    pause(800);

					    WebElement messageInput = shortWait.until(ExpectedConditions.elementToBeClickable(By.xpath(xpathMessageInput)));
					    messageInput.click();
					    pause(300);

					    String reminder = createReminderFor(patient, consultation);
					    
					    messageInput.sendKeys(reminder);
					    
					    WebElement sendButton = shortWait.until(ExpectedConditions.elementToBeClickable(By.xpath(xpathSendMessageButton)));
					    sendButton.click();

					    pause(1000);
					}
					catch (org.openqa.selenium.TimeoutException te) {
						log.warn("Could not send message to telephone: " + patient.getTelephone() + ". Please, check if it exists");
					}
				}				
			}
			
		}
		catch(NoSuchSessionException e) {
			log.warn("Skipping WhatsApp bot.");
		}
		catch(Throwable t) {
			log.error("Error loading chrome driver.", t);
		}
	}
	
	private String createReminderFor(Patient patient, Consultation consultation) {
		SimpleDateFormat sdfDate = new SimpleDateFormat("dd/MM/yyyy");
		SimpleDateFormat sdfTime = new SimpleDateFormat("HH:mm");
		
		String date = sdfDate.format(consultation.getDateTime());
		String time = sdfTime.format(consultation.getDateTime());
		
		String message = messageSource.getMessage("bot.default.message", new String[] {patient.getName(), date, time}, Locale.getDefault());
		return message;
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
	        pause(50 + (long)(Math.random() * 80));
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
