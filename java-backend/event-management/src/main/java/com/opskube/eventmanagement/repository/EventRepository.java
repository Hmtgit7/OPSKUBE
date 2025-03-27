package com.opskube.eventmanagement.repository;

import com.opskube.eventmanagement.model.Event;
import com.opskube.eventmanagement.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

        // Find events containing name (case insensitive)
        Page<Event> findByNameContainingIgnoreCase(String name, Pageable pageable);

        // Find events between date range
        Page<Event> findByDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

        // Find events containing name and between date range
        @Query(value = "SELECT * FROM events e WHERE " +
                        "(:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
                        "(:dateStart IS NULL OR :dateEnd IS NULL OR e.date BETWEEN :dateStart AND :dateEnd)", nativeQuery = true)
        Page<Event> findByNameAndDateRange(
                        @Param("name") String name,
                        @Param("dateStart") LocalDateTime dateStart,
                        @Param("dateEnd") LocalDateTime dateEnd,
                        Pageable pageable);

        // Find events created by user
        List<Event> findByOrganizer(User organizer);

        // Find events user is attending
        @Query("SELECT e FROM Event e JOIN e.rsvps r WHERE r.user.id = :userId")
        List<Event> findAttendingEvents(@Param("userId") Long userId);
}