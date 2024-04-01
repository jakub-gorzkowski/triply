package io.triply.web.model;

import jakarta.persistence.*;
import lombok.*;

/*
 *  The entity class represents a location.
 *
 *  The following properties define the structure of the database table named "location":
 *  - id (PK)
 *  - country
 *  - region
 *  - locale
 *  - street
 *  - address_line
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "location")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "country")
    private String country;

    @Column(name = "region")
    private String region;

    @Column(name = "locale")
    private String locale;

    @Column(name = "street")
    private String street;

    @Column(name = "address_line")
    private String addressLine;
}
