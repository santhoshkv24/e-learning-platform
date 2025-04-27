import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

import studentImage from "../assets/students.png";

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const featuredRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch courses.");
      }
    };

    fetchCourses();
  }, []);

  const handleExploreClick = () => {
    if (featuredRef.current) {
      featuredRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-background py-16 md:py-25 overflow-hidden">
        <div className="container mx-auto px-15">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              className="md:w-1/2 text-left mb-15 md:mb-0 md:pr-12 flex flex-col justify-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-5 text-foreground leading-tight">
                Transform Your Future With Kalvista Platform
              </h1>
              <p className="text-lg mb-10 text-muted-foreground max-w-xl">
                At Kalvista, we believe in empowering learners with the
                knowledge and skills that shape the future. Our expertly
                designed courses offer a blend of flexibility and
                industry-relevant insights, allowing you to learn at your own
                pace, anytime, anywhere. Whether you're looking to enhance your
                career or start a new journey, Kalvista is here to help you
                master the skills of tomorrow.
              </p>
              <div className="flex gap-4">
                <Button onClick={handleExploreClick} size="lg" className="px-8">
                  Explore Courses
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-full max-w-[400px] aspect-square">
                {studentImage ? (
                  <img
                    src={studentImage}
                    alt="Student studying online"
                    className="rounded-full shadow-xl object-cover w-full h-full"
                  />
                ) : (
                  <div className="rounded-full bg-muted w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Student Image</p>
                  </div>
                )}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section ref={featuredRef} className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <p className="text-muted-foreground text-center col-span-full">
                No courses available.
              </p>
            ) : (
              (showAllCourses ? courses : courses.slice(0, 3)).map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            )}
          </div>

          {courses.length > 3 && (
            <div className="mt-8 text-center">
              <Button onClick={() => setShowAllCourses(!showAllCourses)}>
                {showAllCourses ? "View Less" : "View More"}
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
