package org.acme.hibernate.search.elasticsearch.model;
import java.time.LocalDate;
import java.time.LocalDateTime;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class Disponibilidad {

    // SELECT 
    //     fecha.dia,
    //     COUNT(DISTINCT CASE WHEN bitacora.maquina_id IS NULL THEN maquina.id END) AS maquinas_disponibles_por_dia,
    //     COUNT(DISTINCT CASE WHEN bitacora.maquina_id IS NOT NULL THEN maquina.id END) AS maquinas_con_bitacora_por_dia
    // FROM 
    //     (SELECT DISTINCT DATE(fechacreacion) AS dia FROM bitacora) AS fecha
    // CROSS JOIN 
    //     maquina
    // LEFT JOIN 
    //     bitacora ON maquina.id = bitacora.maquina_id 
    //             AND DATE(bitacora.fechacreacion) = fecha.dia
    // GROUP BY 
    //     fecha.dia
    // ORDER BY 
    //     fecha.dia;

    public final LocalDate fechaCreacion;
    public final Long disponibles;
    public final Long en_servicio;

    public Disponibilidad(LocalDateTime fechaCreacion, Long disponibles, Long en_servicio) {
        this.fechaCreacion = (fechaCreacion.toLocalDate());
        this.disponibles = disponibles;
        this.en_servicio = en_servicio;
    }

}
