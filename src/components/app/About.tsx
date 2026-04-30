import { motion } from "framer-motion";
import profileImage from "../../assets/about/profile.png";
import { experienceData } from "../../consts/experience-data";
import { TimelineItem } from "../TimelineItem";

const animationVariants = {
  section: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
  slideInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

const transitionConfig = { once: true, amount: 0.8 };
const animationTiming = { duration: 0.8 };

const ProfileHeader = () => (
  <>
    <h1 className="text-5xl md:text-3xl font-extrabold text-accent mb-6">
      Cillian
      <p>Ó Murchú</p>
    </h1>
    <div className="mt-8 space-y-3">
      <p className="text-accent text-sm"> Creative Engineer</p>
    </div>
  </>
);

const About = () => {
  return (
    <div className="bg-black min-h-screen pt-20 pb-16 flex flex-col items-center justify-start space-y-8 px-4">
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full max-w-6xl gap-12 items-start">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={transitionConfig}
          variants={animationVariants.slideInRight}
          transition={animationTiming}
          className="flex-shrink-0"
        >
          <img
            src={profileImage}
            alt="Portrait of Cillian O'Murchu"
            className="w-80 h-80 rounded-full shadow-lg object-cover border-4 border-accent-subtle"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={transitionConfig}
          variants={animationVariants.slideInLeft}
          transition={animationTiming}
          className="self-center flex-1 flex flex-col justify-center"
        >
          <ProfileHeader />
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={transitionConfig}
        variants={animationVariants.section}
        transition={{ duration: 0.7 }}
        className="md:hidden flex flex-col items-center text-center"
      >
        <img
          src={profileImage}
          alt="Portrait of Cillian O'Murchu"
          className="max-h-[25rem] w-100 h-100 rounded-full shadow-lg object-cover mb-6 border-4 border-white"
        />
        <div className="w-full">
          <ProfileHeader />
        </div>
      </motion.div>

      <TimelineLayout />
    </div>
  );
};

export default About;

export const TimelineLayout = () => {
  return (
    <div className="flex flex-col space-y-12 px-4 py-8 w-full max-w-6xl mx-auto">
      {experienceData.map((work, index) => (
        <TimelineItem key={work.id} work={work} index={index} />
      ))}
    </div>
  );
};
