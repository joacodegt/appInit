package org.acme.hibernate.search.elasticsearch.model;

import java.time.LocalDateTime;
import java.sql.Date;
import java.util.Objects;
import jakarta.persistence.Entity;
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
public class Maquina extends PanacheEntity {

    @FullTextField(analyzer = "nombre")
    @KeywordField(name = "nombre_ordenado", sortable = Sortable.YES, normalizer = "ordenar")
    public String nombre;
    
    @FullTextField(analyzer = "nombre")
    @KeywordField(name = "tipo_ordenado", sortable = Sortable.YES, normalizer = "ordenar")
    public String tipo;
    
    // @Temporal(TemporalType.DATE)
    // public Date fechaCreacion;


    // @PrePersist
    // protected void onCreate() {
    //     fechaCreacion = Date.valueOf(LocalDateTime.now().toLocalDate());
    // }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Maquina)) {
            return false;
        }

        Maquina other = (Maquina) o;

        return Objects.equals(id, other.id);
    }

    @Override
    public int hashCode() {
        return 31;
    }
}
