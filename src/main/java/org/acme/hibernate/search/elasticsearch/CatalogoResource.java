package org.acme.hibernate.search.elasticsearch;

// import org.jboss.logging.Logger;

import java.util.List;
import java.util.Optional;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import org.acme.hibernate.search.elasticsearch.model.Maquina;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.RestQuery;

import io.quarkus.logging.Log;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;


@Path("/catalogo")
@Authenticated
public class CatalogoResource {

    @Inject
    SecurityIdentity identity;

    @Inject
    SearchSession searchSession;
    // private static final Logger LOG = Logger.getLogger(EquipoResource.class);

    @PUT
    @Path("maquina")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void agregarMaquina(@RestForm String nombre,@RestForm String tipo) {
        if(nombre.length() > 0 && tipo.length() > 0){
            Maquina maquina = new Maquina();
            maquina.nombre = nombre;
            maquina.tipo = tipo;
            maquina.persist();
        }
    }

    // @POST
    // @Path("area/{id}")
    // @Transactional
    // @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    // public void actualizarArea(Long id, @RestForm String nombre) {
    //     Area area = Area.findById(id);
    //     if (area == null) {
    //         return;
    //     }
    //     area.nombre = nombre;
    //     area.persist();
    // }

    // @DELETE
    // @Path("area/{id}")
    // @Transactional
    // public void eliminarArea(Long id) {
    //     Area area = Area.findById(id);
    //     if (area != null) {
    //         if (identity.hasRole("admin")) {
    //             area.delete();
    //         }
    //     }
    // }

    @GET
    @Path("maquina/buscar")
    @Transactional
    public List<Maquina> buscarMaquinas(@RestQuery String pattern,
            @RestQuery Optional<Integer> size) {
        return searchSession.search(Maquina.class)
                .where(f -> pattern == null || pattern.trim().isEmpty() ? f.matchAll()
                        : f.simpleQueryString()
                                .fields("nombre").matching(pattern))
                .sort(f -> f.field("nombre_ordenado"))
                .fetchHits(size.orElse(20));
    }

}