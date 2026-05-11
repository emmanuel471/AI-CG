package com.aicareerguidance.entities;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private boolean isEmailVerified=false;

    @Column(nullable = true)
    private String verificationCode;
    
    @Column(name = "verified_at",nullable =true,updatable = false)
    private LocalDateTime verifiedAt;

    @Column(name = "verification_expiry")
    private LocalDateTime verificationExpiry;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
}
