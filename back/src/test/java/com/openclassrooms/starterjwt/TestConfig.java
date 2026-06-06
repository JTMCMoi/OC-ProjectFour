package com.openclassrooms.starterjwt;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import static org.mockito.Mockito.mock;

@Configuration
@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public JpaMetamodelMappingContext jpaMetamodelMappingContext() {
        return mock(JpaMetamodelMappingContext.class);
    }
    
}