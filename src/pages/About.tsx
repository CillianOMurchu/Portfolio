import Character from "../components/Character/Character";
import DetectiveSection from "../components/Detective/DetectiveSection";
import { JobHistory } from "../components/About/JobHistory";
import { ProfileIntro } from "../components/About/ProfileIntro";

// Hidden until the detective puzzle unlocks it.
const SHOW_JOB_HISTORY = false;

const About = () => (
  <div className="relative flex min-h-screen flex-col items-center justify-start space-y-8 px-4 pt-20 pb-16">
    <ProfileIntro />
    <DetectiveSection />
    {SHOW_JOB_HISTORY && <JobHistory />}
    <Character />
  </div>
);

export default About;
