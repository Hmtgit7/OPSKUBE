package com.opskube.eventmanagement.dto;

import com.opskube.eventmanagement.model.Rsvp;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class RsvpDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RsvpRequest {
        @NotNull(message = "RSVP status is required")
        private Rsvp.RsvpStatus status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RsvpResponse {
        private Long id;
        private UserDto user;
        private Rsvp.RsvpStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RsvpStatusResponse {
        private Rsvp.RsvpStatus rsvpStatus;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RsvpListResponse {
        private List<RsvpResponse> rsvps;
    }
}