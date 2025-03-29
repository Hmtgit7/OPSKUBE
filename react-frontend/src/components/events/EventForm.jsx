// src/components/events/EventForm.jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  LocationMarkerIcon,
  DocumentTextIcon,
  TagIcon
} from '@heroicons/react/outline';
import { eventValidationSchema } from '../../utils/validationUtils';
import { formatDateForInput } from '../../utils/dateUtils';

const EventForm = ({ initialValues, onSubmit, isSubmitting, isEdit = false }) => {
  // Set default initial values if not provided
  const defaultValues = {
    name: '',
    description: '',
    date: formatDateForInput(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)), // Tomorrow
    location: ''
  };

  const formValues = initialValues || defaultValues;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card p-6 md:p-8">
        <Formik
          initialValues={formValues}
          validationSchema={eventValidationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting: formSubmitting, touched, errors }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="name" className="label">
                  Event Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Give your event a name..."
                    className={`input pl-10 ${touched.name && errors.name ? 'input-error' : ''
                      }`}
                  />
                </div>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-text"
                />
              </div>

              <div>
                <label htmlFor="date" className="label">
                  Event Date and Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="datetime-local"
                    name="date"
                    id="date"
                    className={`input pl-10 ${touched.date && errors.date ? 'input-error' : ''
                      }`}
                  />
                </div>
                <ErrorMessage
                  name="date"
                  component="div"
                  className="error-text"
                />
              </div>

              <div>
                <label htmlFor="location" className="label">
                  Event Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LocationMarkerIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    name="location"
                    id="location"
                    placeholder="Where will the event take place?"
                    className={`input pl-10 ${touched.location && errors.location ? 'input-error' : ''
                      }`}
                  />
                </div>
                <ErrorMessage
                  name="location"
                  component="div"
                  className="error-text"
                />
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Event Description
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    rows="5"
                    placeholder="Provide details about your event..."
                    className={`input pl-10 ${touched.description && errors.description ? 'input-error' : ''
                      }`}
                  />
                </div>
                <ErrorMessage
                  name="description"
                  component="div"
                  className="error-text"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={formSubmitting || isSubmitting}
                >
                  {formSubmitting || isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {isEdit ? 'Updating Event...' : 'Creating Event...'}
                    </>
                  ) : (
                    isEdit ? 'Update Event' : 'Create Event'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
};

export default EventForm;