// components/TeamSection.jsx
"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TeamSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const carouselRef = useRef(null);

  // Mentors data
  const mentors = [
    {
      id: 1,
      name: "MS Hendriyawan A, S.T., M.Eng., Ph.D.",
      role: "Wakil Rektor IV",
      image: "/mentor/Bapak Hendri.png",
    },
    {
      id: 2,
      name: "Puji Utomo, S.T., M.Eng.",
      role: "Mentor",
      image: "/mentor/Bapak Puji.png",
    },
  ];

  const [mentorCurrentIndex, setMentorCurrentIndex] = useState(0);

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Akhmad Zaqi Riyadi",
      role: "Video Editor / Web Developer",
      image: "/team/zaqi.png",
    },
    {
      id: 2,
      name: "Adam Zidane A",
      role: "Video Editor",
      image: "/team/zidan.png",
    },
    {
      id: 3,
      name: "Yesi Kristiani",
      role: "Creative Event",
      image: "/team/yesi.png",
    },
    {
      id: 4,
      name: "Steevanica Ferbina",
      role: "Creative Event",
      image: "/team/stev.png",
    },
    {
      id: 5,
      name: "Kirana Puspa Larasati",
      role: "Story Hunter",
      image: "/team/ayas.png",
    },
    {
      id: 6,
      name: "Lutfiah Dwi Fitriani",
      role: "Graphic Design",
      image: "/team/lutphi.png",
    },
    {
      id: 7,
      name: "Fitria Sri Hartati",
      role: "PR and Administration",
      image: "/team/pitria.png",
    },
    {
      id: 8,
      name: "Ritzqy Karina",
      role: "PR and Administration",
      image: "/team/karin.png",
    },
    {
      id: 9,
      name: "Fitri Wahyuni",
      role: "SosMed",
      image: "/team/yunzi.png",
    },
    {
      id: 10,
      name: "Sindhi Kharisma",
      role: "SosMed",
      image: "/team/sindi.png",
    },
  ];

  // Get the total number of possible positions for the carousel
  const maxPositions = Math.max(1, teamMembers.length - cardsPerView + 1);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setCardsPerView(5);
      } else if (window.innerWidth >= 1024) {
        setCardsPerView(4);
      } else if (window.innerWidth >= 768) {
        setCardsPerView(3);
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto scroll effect for mentors (mobile only)
  useEffect(() => {
    if (window.innerWidth < 768) {
      const mentorInterval = setInterval(() => {
        setMentorCurrentIndex((prevIndex) =>
          prevIndex >= mentors.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);

      return () => clearInterval(mentorInterval);
    }
  }, [mentors.length]);

  // Auto scroll effect for team
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= maxPositions - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [maxPositions]);

  // Manual navigation for mentors
  const scrollMentorTo = (direction: string) => {
    if (direction === "next") {
      setMentorCurrentIndex((prevIndex) =>
        prevIndex >= mentors.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setMentorCurrentIndex((prevIndex) =>
        prevIndex <= 0 ? mentors.length - 1 : prevIndex - 1
      );
    }
  };

  // Manual navigation for team
  const scrollTo = (direction: string) => {
    if (direction === "next") {
      setCurrentIndex((prevIndex) =>
        prevIndex >= maxPositions - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex <= 0 ? maxPositions - 1 : prevIndex - 1
      );
    }
  };

  // Jump to specific position
  const jumpToPosition = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2E417A]">
            Our Team
          </h2>
          <div className="w-16 md:w-24 h-1 bg-yellow-400 mx-auto mt-2"></div>
          <p className="text-gray-600 mt-3 md:mt-4 max-w-2xl mx-auto text-sm md:text-base px-4">
            Temui individu-individu berbakat di balik UTY Creative Hub yang
            bekerja tanpa lelah untuk mewujudkan kreativitas dan inovasi.
          </p>
        </motion.div>

        {/* Mentors Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 md:mb-16"
        >
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#2E417A] text-center mb-6 md:mb-8">
            Our Mentors
          </h3>
          
          {/* Desktop: 2 columns */}
          <div className="hidden md:flex justify-center gap-6 lg:gap-8">
            {mentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                className="w-60 lg:w-72" // Perbesar lebar card
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -6 }}
              >
                <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 relative">
                  <div className="w-full aspect-[3/4] relative">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-profile.jpg";
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-6 right-6 bg-white py-5 lg:py-4 px-4 lg:px-4 rounded-md mb-4">
                    <h4 className="text-[#2E417A] font-bold text-lg lg:text-md">
                      {mentor.name}
                    </h4>
                    <p className="text-gray-500 text-base font-semibold">
                      {mentor.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: Sliding carousel */}
          <div className="md:hidden relative px-4">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${mentorCurrentIndex * 100}%)`,
                }}
              >
                {mentors.map((mentor) => (
                  <motion.div
                    key={mentor.id}
                    className="w-full flex-shrink-0 px-2"
                    whileHover={{ y: -6 }}
                  >
                    <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 relative max-w-sm mx-auto">
                      <div className="w-full aspect-[3/4] relative">
                        <img
                          src={mentor.image}
                          alt={mentor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-profile.jpg";
                          }}
                        />
                      </div>
                      <div className="absolute bottom-0 left-6 right-6 bg-white py-5 px-4 rounded-md mb-4">
                        <h4 className="text-[#2E417A] font-bold text-xl">
                          {mentor.name}
                        </h4>
                        <p className="text-gray-500 text-base font-semibold">
                          {mentor.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile mentor navigation buttons */}
            <button
              onClick={() => scrollMentorTo("prev")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#2E417A] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-[#1a2a54] transition-colors"
              aria-label="Previous mentor"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() => scrollMentorTo("next")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#2E417A] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-[#1a2a54] transition-colors"
              aria-label="Next mentor"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Mobile mentor indicator dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {mentors.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setMentorCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    mentorCurrentIndex === index
                      ? "bg-[#2E417A] scale-125"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to mentor ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team Members Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#2E417A] text-center mb-6 md:mb-8">
            Our Team Members
          </h3>

          <div className="relative px-2 md:px-6">
            {/* Previous button */}
            <button
              onClick={() => scrollTo("prev")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#2E417A] text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg -ml-2 md:-ml-5 hover:bg-[#1a2a54] transition-colors"
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Team carousel */}
            <div ref={carouselRef} className="overflow-hidden py-8">
              <div
                className="flex gap-4 transition-all duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / teamMembers.length)}%)`,
                  width: `${(teamMembers.length * 100) / cardsPerView}%`,
                }}
              >
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    className="team-card"
                    style={{ width: `calc(100% / ${teamMembers.length})` }}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="mx-2">
                      {/* Card */}
                      <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 relative">
                        {/* Image container */}
                        <div className="w-full aspect-[3/4] relative">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-profile.jpg"; // Fallback image
                            }}
                          />
                        </div>

                        {/* Name and role info card */}
                        <div className="absolute bottom-0 left-4 right-4 bg-white py-4 px-4 rounded-md mb-3">
                          <h3 className="text-[#2E417A] font-bold text-lg">
                            {member.name}
                          </h3>
                          <p className="text-gray-500 text-sm font-medium">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={() => scrollTo("next")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#2E417A] text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg -mr-2 md:-mr-5 hover:bg-[#1a2a54] transition-colors"
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Indicator dots - FIXED */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxPositions }).map((_, index) => (
              <button
                key={index}
                onClick={() => jumpToPosition(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-[#2E417A] scale-125"
                    : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}