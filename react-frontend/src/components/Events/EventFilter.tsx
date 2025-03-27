import React, { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Grid,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Search, Clear, CalendarToday } from '@mui/icons-material';
import { EventFilter as EventFilterType } from '../../types';

interface EventFilterProps {
    filter: EventFilterType;
    onFilterChange: (filter: EventFilterType) => void;
}

const EventFilter: React.FC<EventFilterProps> = ({ filter, onFilterChange }) => {
    // Local state for form inputs
    const [name, setName] = useState(filter.name || '');
    const [date, setDate] = useState(filter.date || '');

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({
            ...filter,
            name: name || undefined,
            date: date || undefined,
            page: 1, // Reset to first page on new search
        });
    };

    // Clear all filters
    const handleClearFilters = () => {
        setName('');
        setDate('');
        onFilterChange({
            page: 1,
            limit: filter.limit,
        });
    };

    // Check if any filters are active
    const hasActiveFilters = !!(name || date);

    return (
        <Paper className="bg-white dark:bg-gray-800 shadow-md p-4 mb-6">
            <Typography
                variant="h6"
                className="text-gray-900 dark:text-white mb-4 font-medium"
            >
                Search Events
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={5} lg={6}>
                        <TextField
                            fullWidth
                            label="Event Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white dark:bg-gray-700"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search className="text-gray-500 dark:text-gray-300" />
                                    </InputAdornment>
                                ),
                                className: "text-gray-900 dark:text-white"
                            }}
                            InputLabelProps={{
                                className: "text-gray-600 dark:text-gray-300"
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={5} lg={4}>
                        <TextField
                            fullWidth
                            label="Event Date"
                            type="date"
                            variant="outlined"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-white dark:bg-gray-700"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarToday className="text-gray-500 dark:text-gray-300" />
                                    </InputAdornment>
                                ),
                                className: "text-gray-900 dark:text-white"
                            }}
                            InputLabelProps={{
                                shrink: true,
                                className: "text-gray-600 dark:text-gray-300"
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={2} lg={2}>
                        <Box className="flex space-x-2 h-full">
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                className="bg-primary-main hover:bg-primary-dark text-white"
                            >
                                Search
                            </Button>

                            {hasActiveFilters && (
                                <IconButton
                                    onClick={handleClearFilters}
                                    className="text-gray-500 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light"
                                    size="small"
                                >
                                    <Clear />
                                </IconButton>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default EventFilter;