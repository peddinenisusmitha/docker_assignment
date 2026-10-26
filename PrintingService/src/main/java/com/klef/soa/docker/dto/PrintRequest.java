
package com.klef.soa.docker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PrintRequest {

    @NotBlank(message = "Service name is required")
    private String serviceName;

    @NotBlank(message = "Paper type is required")
    private String paperType;

    @NotNull(message = "Price per page is required")
    @Positive(message = "Price must be greater than zero")
    private Double pricePerPage;

    @NotNull(message = "Color printing option is required")
    private Boolean colorPrinting;
}
