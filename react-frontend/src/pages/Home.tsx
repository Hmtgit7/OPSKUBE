import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Button, 
  Grid,
  Paper,
  Card,
  CardContent,
  Container
} from '@mui/material';
import { 
  CalendarToday, 
  Search, 
  AddCircleOutline, 
  PeopleAlt 
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { state: { isAuthenticated } } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Box className="py-16 md:py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            component="h1"
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Manage Events with Ease
          </Typography>
          <Typography
            variant="h6"
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Create, discover, and join events in one place. Our platform makes event management simple and accessible.
          </Typography>
          <Box className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              component={Link}
              to="/events"
              variant="contained"
              size="large"
              className="bg-primary-main hover:bg-primary-dark text-white px-8 py-3"
              startIcon={<Search />}
            >
              Browse Events
            </Button>
            {isAuthenticated ? (
              <Button
                component={Link}
                to="/events/new"
                variant="outlined"
                size="large"
                className="border-primary-main text-primary-main hover:bg-primary-main hover:text-white px-8 py-3"
                startIcon={<AddCircleOutline />}
              >
                Create Event
              </Button>
            ) : (
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                className="border-primary-main text-primary-main hover:bg-primary-main hover:text-white px-8 py-3"
              >
                Sign Up
              </Button>
            )}
          </Box>
        </motion.div>
      </Box>

      {/* Features Section */}
      <Box className="py-16 bg-gray-50 dark:bg-gray-900">
        <Container maxWidth="lg">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h3"
              component="h2"
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Features
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Our platform provides everything you need to manage your events efficiently.
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div variants={itemVariants}>
                  <Paper className="h-full bg-white dark:bg-gray-800 shadow-md p-6 text-center">
                    <Box className="flex justify-center mb-4">
                      <AddCircleOutline className="text-primary-main text-5xl" />
                    </Box>
                    <Typography
                      variant="h6"
                      className="text-gray-900 dark:text-white font-bold mb-2"
                    >
                      Easy Editing
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-600 dark:text-gray-300"
                    >
                      Update event details anytime with our simple editing interface.
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Getting Started Section */}
      <Box className="py-16">
        <Container maxWidth="lg">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h3"
              component="h2"
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Getting Started
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Follow these simple steps to start using our event management platform.
            </Typography>
          </motion.div>

          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Card className="h-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Box className="text-center mb-4">
                    <Typography
                      variant="h2"
                      className="text-6xl font-bold text-primary-main"
                    >
                      1
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    className="text-gray-900 dark:text-white font-bold mb-2 text-center"
                  >
                    Create an Account
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-300 text-center"
                  >
                    Sign up for a free account to get started with all our features.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card className="h-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Box className="text-center mb-4">
                    <Typography
                      variant="h2"
                      className="text-6xl font-bold text-primary-main"
                    >
                      2
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    className="text-gray-900 dark:text-white font-bold mb-2 text-center"
                  >
                    Create or Find Events
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-300 text-center"
                  >
                    Create your own events or discover existing ones that interest you.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card className="h-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Box className="text-center mb-4">
                    <Typography
                      variant="h2"
                      className="text-6xl font-bold text-primary-main"
                    >
                      3
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    className="text-gray-900 dark:text-white font-bold mb-2 text-center"
                  >
                    RSVP and Participate
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-300 text-center"
                  >
                    RSVP to events you want to attend and manage your participation.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box className="mt-12 text-center">
            <Button
              component={Link}
              to={isAuthenticated ? "/events" : "/register"}
              variant="contained"
              size="large"
              className="bg-primary-main hover:bg-primary-dark text-white px-8 py-3"
            >
              {isAuthenticated ? "Browse Events" : "Get Started"}
            </Button>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;