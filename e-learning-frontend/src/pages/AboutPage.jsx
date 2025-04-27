// src/pages/AboutPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

// Import team member photos
import santhoshImg from "../assets/santhosh.jpeg";
import mohithImg from "../assets/mohith.jpeg";
import shafiImg from "../assets/shafi.jpeg";
import kethanImg from "../assets/kethan.jpeg";
const teamMembers = [
  {
    name: "Santhosh",
    email: "santhoshvedakrishnan@gmail.com",
    phone: "9361888416",
    image: santhoshImg,
  },
  {
    name: "Mohith",
    email: "mohithv752006@gmail.com",
    phone: "7095294359",
    image: mohithImg,
  },
  {
    name: "Shafi",
    email: "sk.mohammadshafi3044@gmail.com",
    phone: "6281639579",
    image: shafiImg,
  },
  {
    name: "Kethan",
    email: "narrakethanchowdary@gmail.com",
    phone: "8790799969",
    image: kethanImg,
  },
];

const AboutPage = () => {
  return (
    <div>
      <Navbar />

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-8 text-center text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Us
          </motion.h1>
          

        <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto mb-16 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We are a team focused on creating a simple and effective e-learning platform 
            to help students learn better.
          </motion.p>

          <motion.h1 
            className="text-2xl md:text-2xl font-bold mb-5 text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Meet Our Team
        </motion.h1>
          {/* Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-muted p-6 rounded-xl shadow-lg flex flex-col items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <p className="text-lg font-semibold text-foreground mb-6 mx-auto">
                  {member.name}
                </p>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 object-cover rounded-full mb-6 mx-auto"
                />
                <div className="space-y-2">
                  <p className="text-muted-foreground text-xs font-bold">Email -  {member.email}</p>
                  <p className="text-muted-foreground text-xs font-bold">
                    Phone No - +91 - {member.phone}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
