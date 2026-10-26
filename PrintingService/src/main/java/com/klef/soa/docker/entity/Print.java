package com.klef.soa.docker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "printing")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Print
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable=false)
	private String serviceName;
	
	@Column(nullable=false)
	private String paperType;
	
	@Column(nullable=false)
	private double pricePerPage;
	
	@Column(nullable=false)
	private boolean colorPrinting;
	
	

}
