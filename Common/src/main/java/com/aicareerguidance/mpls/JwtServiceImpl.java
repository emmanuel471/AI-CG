package com.aicareerguidance.mpls;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.aicareerguidance.entities.User;
import com.aicareerguidance.services.JwtService;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    private static final long ACCESS_TOKEN_EXPIRATION = 1000L * 60 * 60;        // 1 hour
    private static final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24;  // 24 hours
    private static final long ID_TOKEN_EXPIRATION = 1000L * 60 * 60;           // 1 hour

    // ======================== ACCESS TOKEN ========================
    @Override
    public String generateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenType", "ACCESS");

        return buildToken(claims, user.getEmail(), ACCESS_TOKEN_EXPIRATION);
    }

    // ======================== REFRESH TOKEN ========================
    @Override
    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenType", "REFRESH");

        return buildToken(claims, user.getEmail(), REFRESH_TOKEN_EXPIRATION);
    }

    // ======================== ID TOKEN ========================
    @Override
    public String generateIdToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tokenType", "ID");
        claims.put("userId", user.getId().toString());
        claims.put("firstName", user.getFirstName());
        claims.put("email", user.getEmail());
        claims.put("lastName", user.getLastName());
        return buildToken(claims, user.getEmail(), ID_TOKEN_EXPIRATION);
    }

    // ======================== BUILD TOKEN ========================
    private String buildToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ======================== VALIDATION ========================

    @Override
    public boolean isAccessTokenValid(String token, User user) {
        return isTokenValid(token, user, "ACCESS");
    }

    @Override
    public boolean isRefreshTokenValid(String token, User user) {
        return isTokenValid(token, user, "REFRESH");
    }

    @Override
    public boolean isIdTokenValid(String token, User user) {
        return isTokenValid(token, user, "ID");
    }

    private boolean isTokenValid(String token, User user, String expectedType) {
        try {
            final String username = extractUsername(token);
            final String tokenType = extractTokenType(token);

            return username.equals(user.getEmail())
                    && !isTokenExpired(token)
                    && expectedType.equals(tokenType);

        } catch (Exception e) {
            return false;
        }
    }

    // ======================== CLAIM EXTRACTION ========================

    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("tokenType", String.class));
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    // ======================== SIGNING KEY ========================
    private Key getSignInKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
