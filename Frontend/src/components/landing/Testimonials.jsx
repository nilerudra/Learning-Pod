import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "John Doe",
    role: "CEO, TechCorp",
    text: "Amazing platform! It has improved our workflow drastically.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJwpnImBtJvNPTWRFnMH_K0iARKE37dR-B9Zi2OTqCM0MYm3jDlfc0WpE&s",
  },
  {
    name: "Jane Smith",
    role: "Developer, CodeX",
    text: "Best service ever! Love how simple it is to use and set up.",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    name: "Alice Johnson",
    role: "Designer, PixelPerfect",
    text: "Love the UI! The design is super clean and smooth.",
    image:
      "data:image/jpeg;base64,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",
  },
];

const TestimonialCard = ({ testimonial, index, darkMode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200 * index);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`p-6 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      } rounded-lg shadow-md transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } hover:scale-105`}
    >
      {/* Profile Image */}
      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Testimonial Text */}
      <p className="text-center text-lg font-medium break-words">
        "{testimonial.text}"
      </p>

      {/* Name & Role */}
      <h4 className="font-semibold mt-3 text-center text-xl">
        {testimonial.name}
      </h4>
      <p
        className={`text-sm ${
          darkMode ? "text-gray-400" : "text-gray-500"
        } text-center`}
      >
        {testimonial.role}
      </p>
    </div>
  );
};

const Testimonials = ({ darkMode }) => {
  return (
    <div className="flex flex-col items-center p-6">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-white text-gray-800">
        What Our Users Say
      </h2>

      {/* Testimonials Grid - Only Show 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {testimonials.map((t, index) => (
          <TestimonialCard
            key={index}
            testimonial={t}
            index={index}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
