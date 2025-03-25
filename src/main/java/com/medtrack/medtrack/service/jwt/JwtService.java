package com.medtrack.medtrack.service.jwt;

import com.medtrack.medtrack.model.dependente.DependenteDetails;
import com.medtrack.medtrack.model.usuario.UsuarioDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(UsuarioDetails usuario) {
        Claims claims = Jwts.claims().setSubject(usuario.getUsername());
        claims.put("categoria", usuario.getTipoConta());
        claims.put("nome", usuario.getNome());
        claims.put("email", usuario.getEmail());
        claims.put("id", usuario.getId());

        return Jwts.builder()

                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateTokenDependente(DependenteDetails dependenteDetails) {
        Claims claims = Jwts.claims().setSubject(dependenteDetails.getUsername());
        claims.put("telefone", dependenteDetails.getTelefone());
        claims.put("nome", dependenteDetails.getNome());
        claims.put("id", dependenteDetails.getIdDependente());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claimsResolver.apply(claims);
    }
}
