package br.edu.ifsp.sysodonto.dto;

import br.edu.ifsp.sysodonto.model.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
    private String name;
    private String email;

    public UserResponse(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public UserResponse(){

    }

    public static UserResponse from(User user) {
        var response = new UserResponse();
        response.name = user.getName();
        response.email = user.getEmail();
        return response;
    }


}
