package org.acme.hibernate.search.elasticsearch.model;

import java.time.LocalDateTime;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import org.hibernate.search.engine.backend.types.Projectable;
import org.hibernate.search.engine.backend.types.Searchable;
import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.IndexedEmbedded;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.quarkus.hibernate.orm.panache.PanacheEntity;

@Entity
@Indexed
public class Bitacora extends PanacheEntity {

   
    @ManyToOne
    @IndexedEmbedded
    public Operador operador;

    @ManyToOne
    @IndexedEmbedded
    public Frente frente;

    @ManyToOne
    @IndexedEmbedded
    public Maquina maquina;
    
    @ManyToOne
    @IndexedEmbedded
    public Finca finca;
    
    
    public Long horometroInicio;
    public Long galones;

    @GenericField
    @Column(length = 4000)
    public String supervisor;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @GenericField(projectable = Projectable.YES, searchable = Searchable.YES, sortable = Sortable.YES)
    @Temporal(TemporalType.TIMESTAMP)
    public LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
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
