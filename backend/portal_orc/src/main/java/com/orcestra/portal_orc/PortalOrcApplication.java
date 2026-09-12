package com.orcestra.portal_orc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PortalOrcApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortalOrcApplication.class, args);
	}

}
