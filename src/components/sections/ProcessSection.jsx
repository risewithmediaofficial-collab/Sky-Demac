import { ArrowRight } from "lucide-react";
import { business } from "../../config";

/**
 * 4-Stage Process / Workflow Section
 */
export default function ProcessSection() {
  return (
    <section className="process-section section-pad">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span /> A CLEAR PATH, START TO FINISH
            </div>
            <h2>Know what comes next.</h2>
          </div>
          <p className="process-intro">
            A thoughtful service journey.
            <br />
            With you at every step.
          </p>
        </div>

        <ol className="process-grid">
          {business.process.map((step, index) => (
            <li key={step.title}>
              <div className="step-line">
                <span>0{index + 1}</span>
                {index !== 4 && <ArrowRight size={17} />}
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        {!business.processConfirmed && (
          <p className="process-note">
            Our proposed service journey. Individual arrangements will be
            confirmed with the workshop.
          </p>
        )}
      </div>
    </section>
  );
}
