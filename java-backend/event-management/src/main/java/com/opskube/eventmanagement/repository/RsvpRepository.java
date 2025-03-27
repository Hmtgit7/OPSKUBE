package com.opskube.eventmanagement.repository;

import com.opskube.eventmanagement.model.Event;
import com.opskube.eventmanagement.model.Rsvp;
import com.opskube.eventmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RsvpRepository extends JpaRepository<Rsvp, Long> {

    List<Rsvp> findByEvent(Event event);

    List<Rsvp> findByUser(User user);

    Optional<Rsvp> findByUserAndEvent(User user, Event event);

    boolean existsByUserAndEvent(User user, Event event);

    void deleteByUserAndEvent(User user, Event event);
}