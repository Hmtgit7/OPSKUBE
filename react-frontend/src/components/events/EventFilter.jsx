import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
    SearchIcon,
    XIcon,
    CalendarIcon,
    FilterIcon
} from '@heroicons/react/outline';
import { eventSearchValidationSchema } from '../../utils/validationUtils';
import { formatDateForInput } from '../../utils/dateUtils';

const EventFilter = ({ initialFilters = {}, onSearch }) => {
    const [showFilters, setShowFilters] = useState(false);

    // Default initial values
    const initialValues = {
        name: initialFilters.name || '',
        date: initialFilters.date ? formatDateForInput(initialFilters.date).split('T')[0] : ''
    };

    const handleSubmit = (values) => {
        onSearch({
            name: values.name || undefined,
            date: values.date || undefined
        });
    };

    const handleReset = (resetForm) => {
        resetForm();
        onSearch({});
    };

    return (
        <div className="card p-4 md:p-6 mb-6">
            <Formik
                initialValues={initialValues}
                validationSchema={eventSearchValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ resetForm, values }) => (
                    <Form>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                            {/* Search by name */}
                            <div className="flex-grow">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <SearchIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="Search events by name..."
                                        className="input pl-10 pr-10"
                                    />
                                    {values.name && (
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => {
                                                resetForm({ values: { ...values, name: '' } });
                                            }}
                                        >
                                            <XIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Mobile filter toggle */}
                            <div className="md:hidden">
                                <button
                                    type="button"
                                    className="w-full btn-secondary flex items-center justify-center"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <FilterIcon className="h-5 w-5 mr-2" />
                                    <span>Filters</span>
                                </button>
                            </div>

                            {/* Desktop date filter */}
                            <div className="hidden md:block w-64">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        type="date"
                                        name="date"
                                        placeholder="Filter by date"
                                        className="input pl-10 pr-10"
                                    />
                                    {values.date && (
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => {
                                                resetForm({ values: { ...values, date: '' } });
                                            }}
                                        >
                                            <XIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Search button */}
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Search
                                </button>
                                {(values.name || values.date) && (
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => handleReset(resetForm)}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile date filter (shown when filters are toggled) */}
                        {showFilters && (
                            <div className="mt-4 md:hidden">
                                <label htmlFor="date-mobile" className="label">
                                    Filter by Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        id="date-mobile"
                                        type="date"
                                        name="date"
                                        className="input pl-10 pr-10"
                                    />
                                    {values.date && (
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => {
                                                resetForm({ values: { ...values, date: '' } });
                                            }}
                                        >
                                            <XIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EventFilter;