package com.opskube.eventmanagement.services;

import com.opskube.eventmanagement.dto.EventDto.EventRequest;
import com.opskube.eventmanagement.dto.EventDto.EventResponse;
import com.opskube.eventmanagement.dto.EventDto.EventsResponse;
import com.opskube.eventmanagement.dto.EventDto.PaginationInfo;
import com.opskube.eventmanagement.dto.UserDto;
import com.opskube.eventmanagement.exception.BadRequestException;
import com.opskube.eventmanagement.exception.ForbiddenException;
import com.opskube.eventmanagement.exception.ResourceNotFoundException;
import com.opskube.eventmanagement.model.Event;
import com.opskube.eventmanagement.model.User;
import com.opskube.eventmanagement.repository.EventRepository;
import com.opskube.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Value("${app.pagination.default-page:0}")
    private int defaultPage;

    @Value("${app.pagination.default-size:10}")
    private int defaultSize;

    @Value("${app.pagination.max-size:100}")
    private int maxSize;

    @Transactional(readOnly = true)
    public EventsResponse getAllEvents(String name, LocalDateTime date, int page, int size) {
        // Validate pagination parameters
        page = Math.max(0, page);
        size = Math.min(maxSize, Math.max(1, size));

        // Create pageable with sorting
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").ascending());

        // Find events based on filters
        Page<Event> eventsPage;

        if (name != null && date != null) {
            // Both name and date filters
            LocalDateTime dateStart = date.with(LocalTime.MIN);
            LocalDateTime dateEnd = date.with(LocalTime.MAX);
            eventsPage = eventRepository.findByNameAndDateRange(name, dateStart, dateEnd, pageable);
        } else if (name != null) {
            // Only name filter
            eventsPage = eventRepository.findByNameContainingIgnoreCase(name, pageable);
        } else if (date != null) {
            // Only date filter
            LocalDateTime dateStart = date.with(LocalTime.MIN);
            LocalDateTime dateEnd = date.with(LocalTime.MAX);
            eventsPage = eventRepository.findByDateBetween(dateStart, dateEnd, pageable);
        } else {
            // No filters
            eventsPage = eventRepository.findAll(pageable);
        }

        // Map events to DTOs
        List<EventResponse> eventResponses = eventsPage.getContent().stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());

        // Create pagination info
        PaginationInfo paginationInfo = PaginationInfo.builder()
                .totalEvents(eventsPage.getTotalElements())
                .totalPages(eventsPage.getTotalPages())
                .currentPage(eventsPage.getNumber())
                .eventsPerPage(eventsPage.getSize())
                .hasNextPage(eventsPage.hasNext())
                .hasPrevPage(eventsPage.hasPrevious())
                .build();

        // Return events with pagination info
        return EventsResponse.builder()
                .events(eventResponses)
                .pagination(paginationInfo)
                .build();
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));

        return mapToEventResponse(event);
    }

    @Transactional
    public EventResponse createEvent(EventRequest eventRequest) {
        // Get current user
        User currentUser = getCurrentUser();

        // Validate event date
        if (eventRequest.getDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Event date cannot be in the past");
        }

        // Create new event
        Event event = Event.builder()
                .name(eventRequest.getName())
                .description(eventRequest.getDescription())
                .date(eventRequest.getDate())
                .location(eventRequest.getLocation())
                .organizer(currentUser)
                .build();

        // Save event
        event = eventRepository.save(event);

        // Return event response
        return mapToEventResponse(event);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest eventRequest) {
        // Get current user
        User currentUser = getCurrentUser();

        // Find event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));

        // Check if current user is the event organizer
        if (!event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You do not have permission to update this event");
        }

        // Update event
        event.setName(eventRequest.getName());
        event.setDescription(eventRequest.getDescription());
        event.setDate(eventRequest.getDate());
        event.setLocation(eventRequest.getLocation());

        // Save updated event
        event = eventRepository.save(event);

        // Return event response
        return mapToEventResponse(event);
    }

    @Transactional
    public void deleteEvent(Long id) {
        // Get current user
        User currentUser = getCurrentUser();

        // Find event
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));

        // Check if current user is the event organizer
        if (!event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You do not have permission to delete this event");
        }

        // Delete event
        eventRepository.delete(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getMyEvents() {
        // Get current user
        User currentUser = getCurrentUser();

        // Get events organized by current user
        List<Event> events = eventRepository.findByOrganizer(currentUser);

        // Map to DTOs and return
        return events.stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAttendingEvents() {
        // Get current user
        User currentUser = getCurrentUser();

        // Get events the user is attending
        List<Event> events = eventRepository.findAttendingEvents(currentUser.getId());

        // Map to DTOs and return
        return events.stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    // Helper methods
    private EventResponse mapToEventResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .date(event.getDate())
                .location(event.getLocation())
                .organizer(mapToUserDto(event.getOrganizer()))
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private User getCurrentUser() {
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();

        // Find user by email
        return userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));
    }
}