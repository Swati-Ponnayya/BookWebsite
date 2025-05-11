package net.javaguides.springboot.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer{

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Note: Use double backslashes \\ or forward slashes /
        registry.addResourceHandler("/uploaded_images/**")
                .addResourceLocations("file:F:/BookWebsite/springboot-backend/uploaded_images/");
    }
}
