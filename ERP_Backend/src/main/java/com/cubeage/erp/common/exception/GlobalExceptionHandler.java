package com.cubeage.erp.common.exception;

import com.cubeage.erp.tenant.exception.*;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    ResponseEntity<ProblemDetail> badRequest(RuntimeException exception) {
        return problem(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler({TenantNotFoundException.class, ResourceNotFoundException.class})
    ResponseEntity<ProblemDetail> notFound(RuntimeException exception) {
        return problem(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler({TenantAccessDeniedException.class, AccessDeniedException.class, ForbiddenException.class})
    ResponseEntity<ProblemDetail> forbidden(RuntimeException exception) {
        return problem(HttpStatus.FORBIDDEN, exception.getMessage());
    }

    @ExceptionHandler(TenantInactiveException.class)
    ResponseEntity<ProblemDetail> tenantInactive(TenantInactiveException exception) {
        return problem(HttpStatus.LOCKED, exception.getMessage());
    }

    @ExceptionHandler(TenantLimitExceededException.class)
    ResponseEntity<ProblemDetail> limit(TenantLimitExceededException exception) {
        return problem(HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ProblemDetail> validation(MethodArgumentNotValidException exception) {
        String detail = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return problem(HttpStatus.UNPROCESSABLE_ENTITY, detail);
    }

    private ResponseEntity<ProblemDetail> problem(HttpStatus status, String detail) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail == null ? status.getReasonPhrase() : detail);
        problem.setType(URI.create("about:blank"));
        return ResponseEntity.status(status).body(problem);
    }
}
