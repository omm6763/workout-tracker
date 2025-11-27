import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

// Full Exercise Database
const EXERCISE_DB = [
  {
    name: "Bench Press",
    muscle: "Chest, Shoulders, Triceps",
    steps: [
      "Lie flat on the bench with eyes under the bar.",
      "Grip bar wider than shoulder-width.",
      "Lower bar slowly to mid-chest.",
      "Press up until arms are straight."
    ]
  },
  {
    name: "Squat",
    muscle: "Quadriceps, Glutes, Hamstrings",
    steps: [
      "Feet shoulder-width apart, bar on upper back.",
      "Keep chest up and back straight.",
      "Lower hips back and down like sitting in a chair.",
      "Push through heels to stand up."
    ]
  },
  {
    name: "Deadlift",
    muscle: "Back, Hamstrings, Glutes",
    steps: [
      "Feet hip-width, bar over mid-foot.",
      "Bend at hips to grip bar.",
      "Keep back flat, lift by driving hips forward.",
      "Lower bar with control."
    ]
  },
  {
    name: "Overhead Press",
    muscle: "Shoulders, Triceps",
    steps: [
      "Stand tall, bar at collarbone.",
      "Press bar straight overhead.",
      "Lock elbows at the top.",
      "Lower slowly to start position."
    ]
  },
  {
    name: "Pull Up",
    muscle: "Back (Lats), Biceps",
    steps: [
      "Hang from bar with overhand grip.",
      "Pull chest up to the bar.",
      "Squeeze back muscles.",
      "Lower all the way down."
    ]
  },
  {
    name: "Dumbbell Row",
    muscle: "Back, Biceps",
    steps: [
      "Knee and hand on bench for support.",
      "Pull dumbbell to hip level.",
      "Keep elbow close to body.",
      "Lower slowly."
    ]
  },
  {
    name: "Lunges",
    muscle: "Quads, Glutes",
    steps: [
      "Step forward with one leg.",
      "Lower hips until knees represent 90° angles.",
      "Push back to start.",
      "Repeat on other leg."
    ]
  },
  {
    name: "Plank",
    muscle: "Core, Abs",
    steps: [
      "Rest on forearms and toes.",
      "Body in straight line from head to heels.",
      "Tighten abs and glutes.",
      "Hold as long as possible."
    ]
  },
  {
    name: "Bicep Curl",
    muscle: "Biceps",
    steps: [
      "Hold dumbbells with palms facing forward.",
      "Curl weights up to shoulders.",
      "Squeeze biceps.",
      "Lower slowly."
    ]
  },
  {
    name: "Tricep Extension",
    muscle: "Triceps",
    steps: [
      "Hold weight above head.",
      "Lower weight behind head by bending elbows.",
      "Keep upper arms still.",
      "Extend arms back up."
    ]
  },
  {
    name: "Leg Press",
    muscle: "Quads, Glutes",
    steps: [
      "Sit with back flat against pad.",
      "Feet shoulder-width on platform.",
      "Lower platform until knees bend 90°.",
      "Push back up."
    ]
  },
  {
    name: "Lat Pulldown",
    muscle: "Back (Lats)",
    steps: [
      "Sit with thighs secured.",
      "Wide grip on bar.",
      "Pull bar down to upper chest.",
      "Release slowly up."
    ]
  }
];

export default function ExerciseGuidePage() {
  const { hash } = useLocation();

  // Auto-scroll logic
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''));
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.border = "2px solid #1aac83";
          setTimeout(() => { element.style.border = "1px solid #eee" }, 2000);
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="progress-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
      <div style={{ marginTop: '40px', marginBottom: '50px', textAlign: 'center' }}>
        <h2 style={{fontSize: '2.5rem'}}>📚 Exercise Library</h2>
        <p style={{color: '#666', fontSize: '1.2rem'}}>Comprehensive guide to form and technique.</p>
      </div>

      <div className="guide-grid">
        {EXERCISE_DB.map((ex) => (
          <div key={ex.name} id={ex.name} className="guide-card">
            <h3 style={{fontSize: '1.6rem', fontWeight: '700', color: '#333', marginBottom: '8px'}}>{ex.name}</h3>
            <div className="muscle-badge">{ex.muscle}</div>
            <ol className="guide-steps">
              {ex.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}