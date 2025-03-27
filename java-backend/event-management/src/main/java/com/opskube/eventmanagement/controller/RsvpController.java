package com.opskube.eventmanagement.controller;

import com.opskube.eventmanagement.dto.RsvpDto.RsvpListResponse;
import com.opskube.eventmanagement.dto.RsvpDto.RsvpRequest;
import com.opskube.eventmanagement.dto.RsvpDto.RsvpResponse;
import com.opskube.eventmanagement.dto.RsvpDto.RsvpStatusResponse;
import com.opskube.eventmanagement.services.RsvpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class RsvpController {

    private final RsvpService rsvpService;

    @PostMapping("/{id}/rsvp")
    public ResponseEntity<Map<String, Object>> createOrUpdateRsvp(
            @PathVariable Long id,
            @Valid @RequestBody RsvpRequest rsvpRequest) {

        RsvpResponse rsvpResponse = rsvpService.createOrUpdateRsvp(id, rsvpRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "RSVP created successfully");
        response.put("rsvp", rsvpResponse);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/rsvp")
    public ResponseEntity<RsvpListResponse> getEventRsvps(@PathVariable Long id) {
        RsvpListResponse rsvpListResponse = rsvpService.getEventRsvps(id);
        return ResponseEntity.ok(rsvpListResponse);
    }

    @GetMapping("/{id}/rsvp/me")
    public ResponseEntity<RsvpStatusResponse> getUserRsvpStatus(@PathVariable Long id) {
        RsvpStatusResponse rsvpStatusResponse = rsvpService.getUserRsvpStatus(id);
        return ResponseEntity.ok(rsvpStatusResponse);
    }

    @DeleteMapping("/{id}/rsvp")
    public ResponseEntity<Map<String, String>> deleteRsvp(@PathVariable Long id) {
        rsvpService.deleteRsvp(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "RSVP removed successfully");

        return ResponseEntity.ok(response);
    }
}