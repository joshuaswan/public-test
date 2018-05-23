package com.joshua.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Created by joshua on 2018-05-14.
 */
@Component
@ConfigurationProperties(prefix = "test")
public class TestConfig {
    private String config;

    public String getConfig() {
        return config;
    }

    public void setConfig(String config) {
        this.config = config;
    }

    @Override
    public String toString() {
        return "TestConfig{" +
                "config='" + config + '\'' +
                '}';
    }
}
