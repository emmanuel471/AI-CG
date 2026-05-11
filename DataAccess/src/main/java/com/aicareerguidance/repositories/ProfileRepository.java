package com.aicareerguidance.repositories;

import com.aicareerguidance.entities.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    Optional<Profile> findByUser_Id(UUID userId);
    boolean existsByUser_Id(UUID userId);
}
