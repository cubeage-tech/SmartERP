package com.cubeage.erp.finance.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice(basePackages = "com.cubeage.erp.finance.controller")
public class FinanceExceptionHandler {

	@ExceptionHandler(DuplicateAccountCodeException.class)
	public ResponseEntity<Map<String, Object>> handleDuplicateAccount(DuplicateAccountCodeException ex) {
		return buildResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage());
	}

	@ExceptionHandler(AccountNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleAccountNotFound(AccountNotFoundException ex) {
		return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage());
	}

	@ExceptionHandler(JournalEntryNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleJournalEntryNotFound(JournalEntryNotFoundException ex) {
		return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage());
	}

	@ExceptionHandler(InactiveAccountException.class)
	public ResponseEntity<Map<String, Object>> handleInactiveAccount(InactiveAccountException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage());
	}

	@ExceptionHandler(UnbalancedJournalException.class)
	public ResponseEntity<Map<String, Object>> handleUnbalancedJournal(UnbalancedJournalException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage());
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage());
	}

	private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String error, String message) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("timestamp", Instant.now().toString());
		body.put("status", status.value());
		body.put("error", error);
		body.put("message", message);
		return ResponseEntity.status(status).body(body);
	}
}
