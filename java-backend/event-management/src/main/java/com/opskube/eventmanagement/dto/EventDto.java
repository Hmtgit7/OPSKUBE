package com.opskube.eventmanagement.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class EventDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventRequest {
        @NotBlank(message = "Event name is required")
        @Size(min = 3, max = 100, message = "Event name must be between 3 and 100 characters")
        private String name;

        @NotBlank(message = "Event description is required")
        private String description;

        @NotNull(message = "Event date is required")
        @Future(message = "Event date must be in the future")
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        private LocalDateTime date;

        @NotBlank(message = "Event location is required")
        private String location;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventResponse {
        private Long id;
        private String name;
        private String description;
        
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
        private LocalDateTime date;
        
        private String location;
        private UserDto organizer;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventsResponse {
        private List<EventResponse> events;
        private PaginationInfo pagination;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaginationInfo {
        private long totalEvents;
        private int totalPages;
        private int currentPage;
        private int eventsPerPage;
        private boolean hasNextPage;
        private boolean hasPrevPage;
    }
}