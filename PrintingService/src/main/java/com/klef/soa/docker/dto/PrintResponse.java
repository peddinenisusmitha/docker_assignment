
package com.klef.soa.docker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrintResponse {

    private Long id;
    private String serviceName;
    private String paperType;
    private Double pricePerPage;
    private Boolean colorPrinting;
}
