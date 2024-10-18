package org.acme.hibernate.search.elasticsearch;

import java.util.List;
import java.util.Optional;

import jakarta.enterprise.event.Observes;
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
import org.acme.hibernate.search.elasticsearch.model.Finca;
import org.acme.hibernate.search.elasticsearch.model.Bitacora;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.RestQuery;

import org.jboss.logging.Logger;
import io.quarkus.security.identity.SecurityIdentity;
import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.stream.Collectors;
import io.quarkus.runtime.StartupEvent;

@Path("/catalogo")
public class CatalogoResource {
    private static final Logger LOG = Logger.getLogger(CatalogoResource.class);

    @Inject
    SecurityIdentity identity;

    @Inject
    SearchSession searchSession;

    @Transactional
    void onStart(@Observes StartupEvent ev) throws InterruptedException {
        // only reindex if we imported some content
        if (Maquina.count() > 0) {
            searchSession.massIndexer()
                    .startAndWait();
        }
    }

    private boolean isValidString(String str) {
        return str != null && !str.trim().isEmpty();
    }

    private boolean isEmptyPattern(String pattern) {
        return pattern == null || pattern.trim().isEmpty();
    }

    private <T> List<T> buscarEntidad(Class<T> entityClass, String pattern, Optional<Integer> size, Optional<Integer> page) {
        int pageSize = size.orElse(20);
        int pageNumber = page.orElse(0);
        List<T> lista = (searchSession.search(entityClass)
                .where(f -> {
                    if (isEmptyPattern(pattern)) {
                        return f.matchAll();
                    } else {
                        // Convertir el patrón a LocalDateTime si es posible
                        LocalDateTime fechaCreacion = null;
                        LocalDateTime fechaCreacionFin = null;
                        try {
                            fechaCreacion = convertirFecha(pattern,"yyyy-MM-dd");
                            fechaCreacionFin = convertirFecha(pattern+"T23:59:59","");
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        if (fechaCreacion != null && fechaCreacionFin != null) {
                            LOG.info("con fechaCreacion: "+fechaCreacion);
                            LOG.info("fechaCreacionFin: "+fechaCreacionFin);
                            return f.range().field("fechaCreacion").between(fechaCreacion, fechaCreacionFin);
                        } else {
                            LOG.info("sin fechaCreacion");
                            return f.match().fields("nombre").matching(pattern);
                        }
                    }
                })
                .sort(f -> f.field("fechaCreacion").desc())
                .sort(f -> f.field("nombre_ordenado"))
                .fetchHits(pageNumber * pageSize, pageSize));
        LOG.info(lista.size());
        return lista;
    }

    private <T> void eliminarEntidad(Class<T> entityClass, Long id) {
        T entity = searchSession.toEntityManager().find(entityClass, id);
        if (entity != null && identity.hasRole("admin")) {
            searchSession.toEntityManager().remove(entity);
        }
    }

    public LocalDateTime convertirFecha(String pattern, String formatoFecha) throws Exception{
        LOG.info("pattern: "+pattern);
        LocalDateTime fechaCreacion = null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(formatoFecha);
        try {
            if (formatoFecha.equals("")) {
                fechaCreacion = LocalDateTime.parse(pattern);
            }else{
                fechaCreacion = LocalDateTime.parse(LocalDate.parse(pattern, formatter).atStartOfDay().toString());
            }
            LOG.info("conversion de fecha correcta : "+pattern);
            return fechaCreacion;
        } catch (DateTimeParseException e) {
            throw new Exception("Error al convertir la fecha");
        }
    }

    @PUT
    @Path("bitacora")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void agregarBitacora(
            @RestForm String operador,
            @RestForm String frente,
            @RestForm String maquina,
            @RestForm String finca,
            @RestForm String horometroInicio,
            @RestForm String galones) {
        Bitacora bitacora = new Bitacora();
        LOG.info("nombre: " + operador);
        bitacora.operador = Operador.findById(Long.parseLong(operador));
        bitacora.frente = Frente.findById(Long.parseLong(frente));
        bitacora.maquina = Maquina.findById(Long.parseLong(maquina));
        bitacora.finca = Finca.findById(Long.parseLong(finca));
        bitacora.horometroInicio = Long.parseLong(horometroInicio);
        bitacora.galones = Long.parseLong(galones);
        bitacora.supervisor = TokenDebugger.decoded;
        bitacora.persist();

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
    @Path("finca")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void agregarFinca(@RestForm String nombre) {
        if (isValidString(nombre)) {
            Finca finca = new Finca();
            finca.nombre = nombre;
            finca.persist();
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
    @Path("finca/{id}")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void actualizarFinca(Long id, @RestForm String nombre) {
        Finca finca = Finca.findById(id);
        if (finca == null) {
            return;
        }
        finca.nombre = nombre;
        finca.persist();
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
    @Path("maquina/{id}")
    @Transactional
    public void eliminarMaquina(Long id) {
        eliminarEntidad(Maquina.class, id);
    }

    @DELETE
    @Path("finca/{id}")
    @Transactional
    public void eliminarFinca(Long id) {
        eliminarEntidad(Finca.class, id);
    }

    @DELETE
    @Path("frente/{id}")
    @Transactional
    public void eliminarFrente(Long id) {
        eliminarEntidad(Frente.class, id);
    }

    @DELETE
    @Path("operador/{id}")
    @Transactional
    public void eliminarOperador(Long id) {
        eliminarEntidad(Operador.class, id);
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
    @Path("bitacora/buscar")
    @Transactional
    public List<Bitacora> buscarBitacora(@RestQuery String pattern, @RestQuery Optional<Integer> size, @RestQuery Optional<Integer> page) {
        int pageSize = size.orElse(25);
        int pageNumber = page.orElse(0);
        var resultado = (searchSession.search(Bitacora.class)
        .where(f -> {
            if (isEmptyPattern(pattern)) {
                return f.matchAll();
            } else {
                // Convertir el patrón a LocalDateTime si es posible
                LocalDateTime fechaCreacion = null;
                LocalDateTime fechaCreacionFin = null;
                try {
                    fechaCreacion = convertirFecha(pattern,"yyyy-MM-dd");
                    fechaCreacionFin = convertirFecha(pattern+"T23:59:59","");
                } catch (Exception e) {
                    e.printStackTrace();
                }
                if (fechaCreacion != null && fechaCreacionFin != null) {
                    return f.range().field("fechaCreacion").between(fechaCreacion,fechaCreacionFin);
                } else {
                    return f.match().fields("frente.nombre", "maquina.nombre", "finca.nombre").matching(pattern);
                }
            }
        })
        .sort(f -> f.field("fechaCreacion").desc())
        .fetchHits(pageNumber*pageSize, pageSize));
        return resultado;
    }

    @GET
    @Path("maquina/buscar")
    @Transactional
    public List<Maquina> buscarMaquinas(@RestQuery String pattern, @RestQuery Optional<Integer> size, @RestQuery Optional<Integer> page) {
        return buscarEntidad(Maquina.class, pattern, size, page);
    }

    @GET
    @Path("frente/buscar")
    @Transactional
    public List<Frente> buscarFrente(@RestQuery String pattern, @RestQuery Optional<Integer> size, @RestQuery Optional<Integer> page) {
        return buscarEntidad(Frente.class, pattern, size, page);
    }

    @GET
    @Path("finca/buscar")
    @Transactional
    public List<Finca> buscarFinca(@RestQuery String pattern, @RestQuery Optional<Integer> size, @RestQuery Optional<Integer> page) {
        return buscarEntidad(Finca.class, pattern, size, page);
    }

    @GET
    @Path("operador/buscar")
    @Transactional
    public List<Operador> buscarOperador(@RestQuery String pattern, @RestQuery Optional<Integer> size, @RestQuery Optional<Integer> page) {
        return buscarEntidad(Operador.class, pattern, size, page);
    }

    @GET
    @Path("paginacion")
    @Transactional
    public long cantidadPaginas(@RestQuery String modelo) {
        long total = 0;
        if ("operador".equalsIgnoreCase(modelo)) {
            total = searchSession.search(Operador.class)
                .where(f -> f.matchAll())
                .fetchTotalHitCount();
        } else if ("maquina".equalsIgnoreCase(modelo)) {
            total = searchSession.search(Maquina.class)
                .where(f -> f.matchAll())
                .fetchTotalHitCount();
        }else if ("frente".equalsIgnoreCase(modelo)) {
            total = searchSession.search(Frente.class)
                .where(f -> f.matchAll())
                .fetchTotalHitCount();
        }else if ("finca".equalsIgnoreCase(modelo)) {
            total = searchSession.search(Finca.class)
                .where(f -> f.matchAll())
                .fetchTotalHitCount();
        }else if ("bitacora".equalsIgnoreCase(modelo)) {
            total = searchSession.search(Bitacora.class)
                .where(f -> f.matchAll())
                .fetchTotalHitCount();
        }
        return total/25;
    }
}
