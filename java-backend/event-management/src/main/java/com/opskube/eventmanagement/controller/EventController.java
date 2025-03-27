package com.opskube.eventmanagement.controller;

import com.opskube.eventmanagement.dto.EventDto.EventRequest;
import com.opskube.eventmanagement.dto.EventDto.EventResponse;
import com.opskube.eventmanagement.dto.EventDto.EventsResponse;
import com.opskube.eventmanagement.services.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<EventsResponse> getAllEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        EventsResponse eventsResponse = eventService.getAllEvents(name, date, page, limit);
        return ResponseEntity.ok(eventsResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        EventResponse eventResponse = eventService.getEventById(id);
        return ResponseEntity.ok(eventResponse);
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest eventRequest) {
        EventResponse eventResponse = eventService.createEvent(eventRequest);
        return new ResponseEntity<>(eventResponse, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest eventRequest) {

        EventResponse eventResponse = eventService.updateEvent(id, eventRequest);
        return ResponseEntity.ok(eventResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Event deleted successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-events")
    public ResponseEntity<List<EventResponse>> getMyEvents() {
        List<EventResponse> eventResponses = eventService.getMyEvents();
        return ResponseEntity.ok(eventResponses);
    }

    @GetMapping("/attending")
    public ResponseEntity<List<EventResponse>> getAttendingEvents() {
        List<EventResponse> eventResponses = eventService.getAttendingEvents();
        return ResponseEntity.ok(eventResponses);
    }
}