package com.opskube.eventmanagement.util;

import com.opskube.eventmanagement.model.Event;
import com.opskube.eventmanagement.model.Rsvp;
import com.opskube.eventmanagement.model.User;
import com.opskube.eventmanagement.repository.EventRepository;
import com.opskube.eventmanagement.repository.RsvpRepository;
import com.opskube.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Database seeder for development environment
 * Only runs when spring.profiles.active=dev
 */
@Configuration
@RequiredArgsConstructor
@Profile("dev")
public class DatabaseSeeder {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RsvpRepository rsvpRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedDatabase() {
        return args -> {
            // Clear existing data
            rsvpRepository.deleteAll();
            eventRepository.deleteAll();
            userRepository.deleteAll();

            // Create users
            List<User> users = createUsers();
            userRepository.saveAll(users);
            System.out.println("Created " + users.size() + " users");

            // Create events
            List<Event> events = createEvents(users);
            eventRepository.saveAll(events);
            System.out.println("Created " + events.size() + " events");

            // Create RSVPs
            List<Rsvp> rsvps = createRsvps(users, events);
            rsvpRepository.saveAll(rsvps);
            System.out.println("Created " + rsvps.size() + " RSVPs");

            System.out.println("Database seeding completed successfully");
        };
    }

    private List<User> createUsers() {
        return Arrays.asList(
            User.builder()
                .username("john_doe")
                .email("john@example.com")
                .password(passwordEncoder.encode("password123"))
                .build(),
            User.builder()
                .username("jane_smith")
                .email("jane@example.com")
                .password(passwordEncoder.encode("password123"))
                .build(),
            User.builder()
                .username("bob_johnson")
                .email("bob@example.com")
                .password(passwordEncoder.encode("password123"))
                .build(),
            User.builder()
                .username("alice_green")
                .email("alice@example.com")
                .password(passwordEncoder.encode("password123"))
                .build(),
            User.builder()
                .username("mike_brown")
                .email("mike@example.com")
                .password(passwordEncoder.encode("password123"))
                .build()
        );
    }

    private List<Event> createEvents(List<User> users) {
        return Arrays.asList(
            Event.builder()
                .name("Tech Conference 2025")
                .description("Annual technology conference featuring the latest innovations")
                .date(LocalDateTime.parse("2025-06-15T09:00:00"))
                .location("San Francisco Convention Center")
                .organizer(users.get(0))
                .build(),
            Event.builder()
                .name("Summer Music Festival")
                .description("Outdoor music festival with top artists")
                .date(LocalDateTime.parse("2025-07-20T17:00:00"))
                .location("Central Park")
                .organizer(users.get(1))
                .build(),
            Event.builder()
                .name("Data Science Workshop")
                .description("Hands-on workshop for data analysis and machine learning")
                .date(LocalDateTime.parse("2025-05-10T10:00:00"))
                .location("Tech Hub Downtown")
                .organizer(users.get(0))
                .build(),
            Event.builder()
                .name("Charity Run")
                .description("5K run to raise funds for local charities")
                .date(LocalDateTime.parse("2025-04-05T08:00:00"))
                .location("City Park")
                .organizer(users.get(2))
                .build(),
            Event.builder()
                .name("Art Exhibition")
                .description("Exhibition of contemporary art from local artists")
                .date(LocalDateTime.parse("2025-08-12T18:30:00"))
                .location("Metropolitan Art Gallery")
                .organizer(users.get(3))
                .build(),
            Event.builder()
                .name("Business Networking")
                .description("Connect with professionals in your industry")
                .date(LocalDateTime.parse("2025-05-25T19:00:00"))
                .location("Grand Hotel Conference Room")
                .organizer(users.get(4))
                .build(),
            Event.builder()
                .name("Yoga Retreat")
                .description("Weekend of yoga and meditation")
                .date(LocalDateTime.parse("2025-09-18T08:00:00"))
                .location("Mountain View Resort")
                .organizer(users.get(1))
                .build(),
            Event.builder()
                .name("Book Club Meeting")
                .description("Discussion of this month's book selection")
                .date(LocalDateTime.parse("2025-04-30T18:00:00"))
                .location("City Library")
                .organizer(users.get(3))
                .build(),
            Event.builder()
                .name("Food Festival")
                .description("Taste dishes from top local restaurants")
                .date(LocalDateTime.parse("2025-10-10T12:00:00"))
                .location("Downtown Food Court")
                .organizer(users.get(2))
                .build(),
            Event.builder()
                .name("Career Fair")
                .description("Meet recruiters from top companies")
                .date(LocalDateTime.parse("2025-06-28T10:00:00"))
                .location("University Campus")
                .organizer(users.get(4))
                .build()
        );
    }

    private List<Rsvp> createRsvps(List<User> users, List<Event> events) {
        return Arrays.asList(
            createRsvp(users.get(1), events.get(0), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(2), events.get(0), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(3), events.get(0), Rsvp.RsvpStatus.MAYBE),
            createRsvp(users.get(4), events.get(0), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(0), events.get(1), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(2), events.get(1), Rsvp.RsvpStatus.DECLINED),
            createRsvp(users.get(3), events.get(1), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(1), events.get(2), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(3), events.get(2), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(4), events.get(2), Rsvp.RsvpStatus.MAYBE),
            createRsvp(users.get(0), events.get(3), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(1), events.get(3), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(4), events.get(3), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(0), events.get(4), Rsvp.RsvpStatus.MAYBE),
            createRsvp(users.get(1), events.get(4), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(2), events.get(4), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(0), events.get(5), Rsvp.RsvpStatus.ATTENDING),
            createRsvp(users.get(1), events.get(5), Rsvp.RsvpStatus.DECLINED),
            createRsvp(users.get(2), events.get(5), Rsvp.RsvpStatus.MAYBE),
            createRsvp(users.get(3), events.get(5), Rsvp.RsvpStatus.ATTENDING)
        );
    }

    private Rsvp createRsvp(User user, Event event, Rsvp.RsvpStatus status) {
        return Rsvp.builder()
            .user(user)
            .event(event)
            .status(status)
            .build();
    }
}