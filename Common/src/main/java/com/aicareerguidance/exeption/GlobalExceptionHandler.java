
package com.aicareerguidance.exeption;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.access.AccessDeniedException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // -------------------- Handle illegal arguments --------------------
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .message(ex.getMessage()) 
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .success(false)
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // -------------------- Handle duplicate --------------------
    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<ApiResponse<Object>> handleException(DuplicateException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .message(ex.getMessage())
                .statusCode(HttpStatus.CONFLICT.value()) 
                .success(false)
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    // -------------------- Handle not found --------------------
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleLearnerNotFound(NotFoundException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .message(ex.getMessage())
                .statusCode(HttpStatus.NOT_FOUND.value())
                .success(false)
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // -------------------- Handle validation errors --------------------
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        // Construct a clear message with first error
        String message = errors.isEmpty() ? "Validation failed" 
                                        : "Validation failed: " + errors.values().iterator().next();

        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .message(message)   
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .success(false)
                .data(null)       
                .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // -------------------- Handle illegal state (e.g. delete blocked by constraint) --------------------
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalState(IllegalStateException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .message(ex.getMessage())
                .statusCode(HttpStatus.CONFLICT.value())
                .success(false)
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    // -------------------- Handle generic exceptions --------------------
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .message(ex.getMessage())
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .success(false)
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 401 - Unauthorized (invalid credentials)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentials(BadCredentialsException ex) {

        ApiResponse<Object> response = ApiResponse.builder()
                .message(ex.getMessage())  
                .statusCode(401)
                .success(false)
                .data(null)
                .build();

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    // 403 - Forbidden (role restriction)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(AccessDeniedException ex) {

        ApiResponse<Object> response = ApiResponse.builder()
                .message("Forbidden")
                .statusCode(403)
                .success(false)
                .data(null)
                .build();

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    // 402 - Payment Required (no active subscription)
    @ExceptionHandler(SubscriptionRequiredException.class)
    public ResponseEntity<ApiResponse<Object>> handleSubscriptionRequired(SubscriptionRequiredException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .message(ex.getMessage())
                .statusCode(402)
                .success(false)
                .data(null)
                .build();
        return new ResponseEntity<>(response, HttpStatus.PAYMENT_REQUIRED);
    }
}
