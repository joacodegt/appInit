package org.acme.hibernate.search.elasticsearch.model;

import java.time.LocalDateTime;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class Eficiencia {

//     SELECT  
//     maquina.nombre,
//     bitacora.fechaCreacion, 
//     bitacora.horometroInicio, 
//     bitacora.galones, 
//     RANK() OVER (PARTITION BY maquina.nombre ORDER BY bitacora.fechaCreacion DESC) AS ranking,
//     LEAD(bitacora.horometroInicio) OVER (PARTITION BY maquina.nombre ORDER BY bitacora.fechaCreacion DESC) AS horometroFinal,
//     LEAD(bitacora.fechaCreacion) OVER (PARTITION BY maquina.nombre ORDER BY bitacora.fechaCreacion DESC) AS siguientefecha,
//     CASE 
//         WHEN bitacora.galones > 0 THEN 
//             ROUND((bitacora.horometroInicio - LEAD(bitacora.horometroInicio) OVER (PARTITION BY maquina.nombre ORDER BY bitacora.fechaCreacion DESC))::decimal / bitacora.galones, 1)  -- Convertir a decimal
//         ELSE NULL  -- Evitar división por cero
//     END AS eficiencia
// FROM 
//     bitacora AS bitacora
// LEFT JOIN 
//     public.maquina AS maquina ON bitacora.maquina_id = maquina.id 
// ORDER BY 
//     maquina.nombre, ranking;

    public final String maquina;
    public final LocalDateTime fechaCreacion;
    public final Long horometroInicio;
    public final Long galones;
    public final Long ranking;
    public final Long horometroFinal;
    public final LocalDateTime siguientefecha;
    public final Long eficiencia;

    public Eficiencia(String maquina, LocalDateTime fechaCreacion, Long horometroInicio, Long galones, Long ranking, Long horometroFinal, LocalDateTime siguientefecha, Long eficiencia) {
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
