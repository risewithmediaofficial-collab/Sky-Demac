import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { business } from "../../config";
import SafeImage from "../common/SafeImage";

/**
 * About / Workshop Philosophy Section
 */
export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="wrap about-layout">
        <div>
          <div className="eyebrow light">
            <span /> MEET SKY DEMAC
          </div>
          <h2>
            For people who
            <br />
            care about
            <br />
            <span>their cars.</span>
          </h2>
        </div>

        <div className="about-copy">
          <p className="about-lead">
            More than a way to get there.
            <br />
            Your car is part of your everyday.
          </p>
          <p>
            SKY DEMAC AUTOMOTIVE brings a focus on complete automotive care,
            premium detailing and professional maintenance. Our approach begins
            with understanding the car, the concern and the person behind the
            wheel.
          </p>
          <Link to="/about" className="text-link light-link">
            Get to know SKY DEMAC <ArrowUpRight size={18} />
          </Link>
        </div>

        {business.studioImage && (
          <SafeImage
            className="studio-image"
            src={business.studioImage}
            alt="The SKY DEMAC AUTOMOTIVE workshop"
            width="1200"
            height="700"
            loading="lazy"
          />
        )}
      </div>
    </section>
  );
}
