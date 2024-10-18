package org.acme.hibernate.search.elasticsearch;


import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

import java.net.URI;

import org.eclipse.microprofile.config.inject.ConfigProperty;
// import org.jboss.logging.Logger;

import io.quarkus.security.identity.SecurityIdentity;


@Path("/logout")
public class Logout {
    // private static final Logger LOG = Logger.getLogger(Logout.class);
    @ConfigProperty(name = "quarkus.oidc.logout.path")
    String logoutPath;

    @ConfigProperty(name = "quarkus.oidc.logout.post-logout-path")
    String postLogoutPath;

    @Inject
    SecurityIdentity identity;

    @GET
    public Response logout() {
        String redirectUri = logoutPath + "?post_logout_redirect_uri=" + postLogoutPath;
        return Response.status(Response.Status.FOUND).location(URI.create(redirectUri)).build();
    }
}
