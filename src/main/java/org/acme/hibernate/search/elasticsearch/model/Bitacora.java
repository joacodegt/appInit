package org.acme.hibernate.search.elasticsearch.model;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Objects;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

import io.quarkus.hibernate.orm.panache.PanacheEntity;

@Entity
@Indexed
public class Bitacora extends PanacheEntity {

   
    @ManyToOne
    public Operador operador;

    @ManyToOne
    public Frente frente;

    @ManyToOne
    public Maquina maquina;
    
    @ManyToOne
    public Finca finca;
    
    
    public Long horometroInicio;
    public Long galonesInicio;

    public Long horometroFin;
    public Long galonesFin;
    
    public String supervisor;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bitacora)) {
            return false;
        }

        Bitacora other = (Bitacora) o;

        return Objects.equals(id, other.id);
    }

    @Override
    public int hashCode() {
        return 31;
    }
}
