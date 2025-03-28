import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import CalendarToday from "@mui/icons-material/CalendarToday";
import LocationOn from "@mui/icons-material/LocationOn";
import Person from "@mui/icons-material/Person";
import AccessTime from "@mui/icons-material/AccessTime";;
import { Event } from '../../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = format(new Date(event.date), 'MMMM dd, yyyy');
  const formattedTime = format(new Date(event.date), 'h:mm a');
  
  // Truncate description if it's too long
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardContent className="flex flex-col h-full p-5">
          <Box className="mb-3">
            <Typography
              variant="h5"
              component="h2"
              className="text-gray-900 dark:text-white font-bold mb-2"
            >
              {event.name}
            </Typography>

            <Box className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
              <CalendarToday fontSize="small" className="mr-2" />
              <Typography variant="body2">{formattedDate}</Typography>
            </Box>

            <Box className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
              <AccessTime fontSize="small" className="mr-2" />
              <Typography variant="body2">{formattedTime}</Typography>
            </Box>

            <Box className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
              <LocationOn fontSize="small" className="mr-2" />
              <Typography variant="body2">{event.location}</Typography>
            </Box>

            {event.organizer && (
              <Box className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                <Person fontSize="small" className="mr-2" />
                <Typography variant="body2">
                  Organized by {event.organizer.username}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography
            variant="body2"
            className="text-gray-600 dark:text-gray-300 flex-grow mb-4"
          >
            {truncateDescription(event.description)}
          </Typography>

          <Box className="mt-auto pt-3 flex justify-between items-center">
            <Button
              component={Link}
              to={`/events/${event.id}`}
              variant="contained"
              size="small"
              className="bg-primary-main hover:bg-primary-dark text-white"
            >
              View Details
            </Button>
            
            {new Date(event.date) > new Date() ? (
              <Chip 
                label="Upcoming" 
                size="small" 
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
              />
            ) : (
              <Chip 
                label="Past" 
                size="small" 
                className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" 
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventCard;