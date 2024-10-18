package org.acme.hibernate.search.elasticsearch.model;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.IndexedEmbedded;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.quarkus.hibernate.orm.panache.PanacheEntity;

@Entity
@Indexed
public class Frente extends PanacheEntity {

    @FullTextField(analyzer = "nombre")
    @KeywordField(name = "nombre_ordenado", sortable = Sortable.YES, normalizer = "ordenar")
    public String nombre;

    @Temporal(TemporalType.DATE)
    public Date fechaCreacion;
    
    @OneToMany(mappedBy = "frente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnore
    public List<Bitacora> bitacoras;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = Date.valueOf(LocalDateTime.now().toLocalDate());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Frente)) {
            return false;
        }

        Frente other = (Frente) o;

        return Objects.equals(id, other.id);
    }

    @Override
    public int hashCode() {
        return 31;
    }
}
