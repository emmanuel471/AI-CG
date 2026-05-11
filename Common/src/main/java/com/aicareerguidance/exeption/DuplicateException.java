package com.aicareerguidance.exeption;

public class DuplicateException extends RuntimeException {
    public DuplicateException(String message) {
        super(message);
    }
}