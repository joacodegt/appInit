package org.acme.hibernate.search.elasticsearch.model;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Objects;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;

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
    public Long galones;

    
    public String supervisor;

    @Temporal(TemporalType.DATE)
    public Date fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = Date.valueOf(LocalDateTime.now().toLocalDate());
    }

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
