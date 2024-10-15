package org.acme.hibernate.search.elasticsearch;

// import com.arjuna.ats.internal.jdbc.drivers.modifiers.list;
// import com.fasterxml.jackson.core.JsonProcessingException;
// import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.security.identity.AuthenticationRequestContext;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.identity.SecurityIdentityAugmentor;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jose4j.base64url.Base64;
import org.jboss.logging.Logger;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TokenDebugger implements SecurityIdentityAugmentor {
    // private final ObjectMapper objectMapper = new ObjectMapper();
    private final Logger LOG = Logger.getLogger(TokenDebugger.class);
    public static String decoded = "";

    @Override
    public Uni<SecurityIdentity> augment(SecurityIdentity securityIdentity, AuthenticationRequestContext authenticationRequestContext) {
        if (securityIdentity.getPrincipal() instanceof JsonWebToken) {
            JsonWebToken principal = (JsonWebToken) securityIdentity.getPrincipal();
            String[] parts = principal.getRawToken().split("\\.");
            decoded = new String(Base64.decode(parts[1]));
            // decoded = "";
            // for (int i = 0; i < parts.length; i++) {
            //     LOG.info("parte"+i);
            // }
            LOG.info("decoded: "+decoded);
        }
        return Uni.createFrom().item(securityIdentity);
    }

    // private String toPrettyJson(String json) {
    //     try {
    //         Object value = objectMapper.readValue(json, Object.class);
    //         return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(value);
    //     } catch (JsonProcessingException e) {
    //         return "";
    //     }
    // }
}
