package br.edu.ifsp.sysodonto.controller;

import org.springframework.security.core.Authentication;

import br.edu.ifsp.sysodonto.exceptions.InvalidSessionException;
import br.edu.ifsp.sysodonto.model.User;

public class SessionChecker {
	public String getLoggedUserId(Authentication auth) throws InvalidSessionException {
		if (auth == null) throw new InvalidSessionException("Você precisa estar logado para esta funcionalidade.");
		User loggedUser = (User) auth.getPrincipal();
        String userId = loggedUser.getId();
        return userId;
	}
}
