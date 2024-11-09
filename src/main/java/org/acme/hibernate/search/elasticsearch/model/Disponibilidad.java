package org.acme.hibernate.search.elasticsearch.model;
import java.time.LocalDateTime;
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class Disponibilidad {

    public final String maquina;
    public final LocalDateTime fechaCreacion;
    public final Long horometroInicio;
    public final Long galones;
    public final Long ranking;
    public final Long horometroFinal;
    public final LocalDateTime siguientefecha;
    public final Long eficiencia;

    public Disponibilidad(String maquina, LocalDateTime fechaCreacion, Long horometroInicio, Long galones, Long ranking, Long horometroFinal, LocalDateTime siguientefecha, Long eficiencia) {
        this.maquina = maquina;
        this.fechaCreacion = fechaCreacion;
        this.horometroInicio = horometroInicio;
        this.galones = galones;
        this.ranking = ranking;
        this.horometroFinal = horometroFinal;
        this.siguientefecha = siguientefecha;
        this.eficiencia = eficiencia;
    }

}
