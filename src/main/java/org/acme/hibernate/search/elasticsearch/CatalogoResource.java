package org.acme.hibernate.search.elasticsearch;

import java.util.List;
import java.util.Optional;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import org.acme.hibernate.search.elasticsearch.model.Maquina;
import org.acme.hibernate.search.elasticsearch.model.Operador;
import org.acme.hibernate.search.elasticsearch.model.Frente;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.RestQuery;

import org.jboss.logging.Logger;
import io.quarkus.security.Authenticated;
import io.quarkus.security.identity.SecurityIdentity;
import java.io.File;
import java.util.Arrays;
import java.util.stream.Collectors;

@Path("/catalogo")
@Authenticated
public class CatalogoResource {
    private static final Logger LOG = Logger.getLogger(CatalogoResource.class);

    @Inject
    SecurityIdentity identity;

    @Inject
    SearchSession searchSession;

    private boolean isValidString(String str) {
        return str != null && !str.trim().isEmpty();
    }

    private boolean isEmptyPattern(String pattern) {
        return pattern == null || pattern.trim().isEmpty();
    }

    private <T> List<T> buscarEntidad(Class<T> entityClass, String pattern, Optional<Integer> size) {
        return searchSession.search(entityClass)
                .where(f -> isEmptyPattern(pattern) ? f.matchAll() : f.simpleQueryString().fields("nombre").matching(pattern))
                .sort(f -> f.field("nombre_ordenado"))
                .fetchHits(size.orElse(20));
    }

    @POST
    @Path("maquina/{id}")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void actualizarMaquina(Long id, @RestForm String nombre, @RestForm String tipo) {
        Maquina maquina = Maquina.findById(id);
        if (maquina == null) {
            return;
        }
        maquina.nombre = nombre;
        maquina.tipo = tipo;
        maquina.persist();
    }

    @DELETE
    @Path("maquina/{id}")
    @Transactional
    public void eliminarMaquina(Long id) {
        Maquina maquina = Maquina.findById(id);
        if (maquina != null) {
            if (identity.hasRole("admin")) {
                maquina.delete();
            }
        }
    }

    @POST
    @Path("frente/{id}")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void actualizarFrente(Long id, @RestForm String nombre) {
        Frente frente = Frente.findById(id);
        if (frente == null) {
            return;
        }
        frente.nombre = nombre;
        frente.persist();
    }

    @DELETE
    @Path("frente/{id}")
    @Transactional
    public void eliminarFrente(Long id) {
        Frente frente = Frente.findById(id);
        if (frente != null) {
            if (identity.hasRole("admin")) {
                frente.delete();
            }
        }
    }

    @PUT
    @Path("maquina")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void agregarMaquina(@RestForm String nombre, @RestForm String tipo) {
        if (isValidString(nombre) && isValidString(tipo)) {
            Maquina maquina = new Maquina();
            maquina.nombre = nombre;
            maquina.tipo = tipo;
            maquina.persist();
        }
    }

    @PUT
    @Path("frente")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void agregarFrente(@RestForm String nombre) {
        if (isValidString(nombre)) {
            Frente frente = new Frente();
            frente.nombre = nombre;
            frente.persist();
        }
    }

    @PUT
    @Path("operador")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void agregarOperador(@RestForm String nombre, @RestForm String codigoEmpleado) {
        if (isValidString(nombre) && isValidString(codigoEmpleado)) {
            Operador operador = new Operador();
            operador.nombre = nombre;
            operador.codigoEmpleado = codigoEmpleado;
            operador.persist();
        }
    }

    @POST
    @Path("operador/{id}")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void actualizarOperador(Long id, @RestForm String nombre, @RestForm String codigoEmpleado) {
        Operador operador = Operador.findById(id);
        if (operador == null) {
            return;
        }
        operador.nombre = nombre;
        operador.codigoEmpleado = codigoEmpleado;
        operador.persist();
    }

    @DELETE
    @Path("operador/{id}")
    @Transactional
    public void eliminarOperador(Long id) {
        Operador operador = Operador.findById(id);
        if (operador != null) {
            if (identity.hasRole("admin")) {
                operador.delete();
            }
        }
    }

    @GET
    @Path("menu/buscar")
    @Transactional
    public List<String> buscarMenu() {
        String modelPath = "src/main/java/org/acme/hibernate/search/elasticsearch/model";
        File modelDirectory = new File(modelPath);

        if (modelDirectory.exists() && modelDirectory.isDirectory()) {
            return Arrays.stream(modelDirectory.listFiles())
                    .filter(file -> file.isFile() && file.getName().endsWith(".java"))
                    .map(file -> file.getName().replace(".java", ""))
                    .collect(Collectors.toList());
        } else {
            LOG.error("Model directory does not exist: " + modelPath);
            return List.of();
        }
    }

    @GET
    @Path("maquina/buscar")
    @Transactional
    public List<Maquina> buscarMaquinas(@RestQuery String pattern, @RestQuery Optional<Integer> size) {
        return buscarEntidad(Maquina.class, pattern, size);
    }

    @GET
    @Path("frente/buscar")
    @Transactional
    public List<Frente> buscarFrente(@RestQuery String pattern, @RestQuery Optional<Integer> size) {
        return buscarEntidad(Frente.class, pattern, size);
    }

    @GET
    @Path("operador/buscar")
    @Transactional
    public List<Operador> buscarOperador(@RestQuery String pattern, @RestQuery Optional<Integer> size) {
        return buscarEntidad(Operador.class, pattern, size);
    }
}
