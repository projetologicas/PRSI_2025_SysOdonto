package br.edu.ifsp.sysodonto.model;

public class User {

	private Long id;
	private String email;
	private String name;
	private String profilePicture;
	private String password;

	public User() {}

	public User(Long id, String email, String name, String profilePicture, String password) {
		this.id = id;
		this.email = email;
		this.name = name;
		this.profilePicture = profilePicture;
		this.password = password;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
}
