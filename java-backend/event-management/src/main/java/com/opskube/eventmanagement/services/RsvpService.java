package com.opskube.eventmanagement.services;

import com.opskube.eventmanagement.dto.RsvpDto.RsvpListResponse;
import com.opskube.eventmanagement.dto.RsvpDto.RsvpRequest;
import com.opskube.eventmanagement.dto.RsvpDto.RsvpResponse;
import com.opskube.eventmanagement.dto.RsvpDto.RsvpStatusResponse;
import com.opskube.eventmanagement.dto.UserDto;
import com.opskube.eventmanagement.exception.BadRequestException;
import com.opskube.eventmanagement.exception.ForbiddenException;
import com.opskube.eventmanagement.exception.ResourceNotFoundException;
import com.opskube.eventmanagement.model.Event;
import com.opskube.eventmanagement.model.Rsvp;
import com.opskube.eventmanagement.model.User;
import com.opskube.eventmanagement.repository.EventRepository;
import com.opskube.eventmanagement.repository.RsvpRepository;
import com.opskube.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RsvpService {

    private final RsvpRepository rsvpRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public RsvpResponse createOrUpdateRsvp(Long eventId, RsvpRequest rsvpRequest) {
        // Get current user
        User currentUser = getCurrentUser();

        // Find event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        // Check if event has already passed
        if (event.getDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot RSVP to a past event");
        }

        // Check if user is not the organizer (organizers don't need to RSVP to their
        // own events)
        if (event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You cannot RSVP to your own event");
        }

        // Check if RSVP already exists
        Rsvp rsvp = rsvpRepository.findByUserAndEvent(currentUser, event)
                .orElse(Rsvp.builder()
                        .user(currentUser)
                        .event(event)
                        .build());

        // Update or set RSVP status
        rsvp.setStatus(rsvpRequest.getStatus());

        // Save RSVP
        rsvp = rsvpRepository.save(rsvp);

        // Return RSVP response
        return mapToRsvpResponse(rsvp);
    }

    @Transactional(readOnly = true)
    public RsvpListResponse getEventRsvps(Long eventId) {
        // Get current user
        User currentUser = getCurrentUser();

        // Find event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        // Check if current user is the event organizer
        if (!event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You do not have permission to view RSVPs for this event");
        }

        // Get all RSVPs for the event
        List<Rsvp> rsvps = rsvpRepository.findByEvent(event);

        // Map to DTOs
        List<RsvpResponse> rsvpResponses = rsvps.stream()
                .map(this::mapToRsvpResponse)
                .collect(Collectors.toList());

        // Return RSVP list response
        return RsvpListResponse.builder()
                .rsvps(rsvpResponses)
                .build();
    }

    @Transactional(readOnly = true)
    public RsvpStatusResponse getUserRsvpStatus(Long eventId) {
        // Get current user
        User currentUser = getCurrentUser();

        // Find event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        // Get user's RSVP for the event
        Rsvp.RsvpStatus rsvpStatus = rsvpRepository.findByUserAndEvent(currentUser, event)
                .map(Rsvp::getStatus)
                .orElse(null);

        // Return RSVP status response
        return RsvpStatusResponse.builder()
                .rsvpStatus(rsvpStatus)
                .build();
    }

    @Transactional
    public void deleteRsvp(Long eventId) {
        // Get current user
        User currentUser = getCurrentUser();

        // Find event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        // Find RSVP
        Rsvp rsvp = rsvpRepository.findByUserAndEvent(currentUser, event)
                .orElseThrow(() -> new ResourceNotFoundException("RSVP not found for this event"));

        // Delete RSVP
        rsvpRepository.delete(rsvp);
    }

    // Helper methods
    private RsvpResponse mapToRsvpResponse(Rsvp rsvp) {
        return RsvpResponse.builder()
                .id(rsvp.getId())
                .user(mapToUserDto(rsvp.getUser()))
                .status(rsvp.getStatus())
                .createdAt(rsvp.getCreatedAt())
                .updatedAt(rsvp.getUpdatedAt())
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