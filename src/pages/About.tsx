import { ProfileIntro } from "../components/About/ProfileIntro";
import { WorkHistory } from "../components/About/WorkHistory";

const About = () => (
  <div className="relative flex min-h-screen flex-col items-center justify-start space-y-8 px-(--gutter) pt-20 pb-16">
    <ProfileIntro />
    <WorkHistory />
  </div>
);

export default About;
