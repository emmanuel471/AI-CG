package com.aicareerguidance.services;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.cloudfront.CloudFrontUrlSigner;
import java.security.KeyFactory;
import java.util.Base64;
import java.net.URLEncoder;

@Service
@Slf4j
public class S3Service {

    private final S3Client s3Client;

    @Value("${application.bucket.name}")
    private String bucketName;

    @Value("${cloudfront.domain}")
    private String cloudFrontDomain;

    @Value("${cloudfront.key-pair-id}")
    private String keyPairId;

    @Value("${cloudfront.private-key}")
    private String privateKeyValue;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String generateSignedUrl(String key, long expirationInHours) {
        try {
            String encodedKey = URLEncoder.encode(key, StandardCharsets.UTF_8.toString())
                                        .replaceAll("\\+", "%20");

            String resourceUrl = cloudFrontDomain + "/" + encodedKey;

            String formattedKey = privateKeyValue.replace("\\n", "\n")
                                                .replace("-----BEGIN PRIVATE KEY-----", "")
                                                .replace("-----END PRIVATE KEY-----", "")
                                                .replaceAll("\\s", "");

            byte[] decodedKey = Base64.getDecoder().decode(formattedKey);

            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PrivateKey privateKey = keyFactory.generatePrivate(keySpec);

            java.util.Date expirationDate = new java.util.Date(
                    System.currentTimeMillis() + expirationInHours * 60 * 60 * 1000
            );

            return CloudFrontUrlSigner.getSignedURLWithCannedPolicy(
                    resourceUrl,
                    keyPairId,
                    privateKey,
                    expirationDate
            );

        } catch (Exception e) {
            log.error("Failed to generate signed URL for key: {}", key, e);
            throw new RuntimeException("Could not generate secure access link.");
        }
    }

    public String uploadFile(MultipartFile file, String folder) {
        try {
            String folderPath = folder.endsWith("/") ? folder : folder + "/";
            String key = folderPath + UUID.randomUUID() + "-" + file.getOriginalFilename();

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            return key;

        } catch (IOException e) {
            log.error("Failed to read bytes from file: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Sorry, we couldn't read your file. Please try again.");
        } catch (Exception e) {
            log.error("Failed to upload file to S3: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Sorry, we couldn't upload your file. Please try again later.");
        }
    }

    public void deleteFile(String key) {
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build());
    }

    public String uploadProfilePicture(MultipartFile file) {
        return uploadFile(file, "profiles-pictures");
    }

    public String uploadLessonVideo(MultipartFile file) {
        return uploadFile(file, "lesson-videos");
    }

}