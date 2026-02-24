import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Starting CyberDuo seed...");

  try {
    // Clear tables in safe order
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.userSubscription);

    // Create main course
    const [course] = await db
      .insert(schema.courses)
      .values({
        title: "Cybersecurity Mastery",
        imageSrc: "/mascot.svg",
      })
      .returning({ id: schema.courses.id });

    // 5 units
    const unitsData = [
      { title: "Unit 1: Security Fundamentals", description: "Core concepts every defender needs", order: 1 },
      { title: "Unit 2: Phishing & Social Engineering", description: "Don't get tricked by humans", order: 2 },
      { title: "Unit 3: Passwords & Authentication", description: "Build unbreakable accounts", order: 3 },
      { title: "Unit 4: Network & Wi-Fi Security", description: "Protect your connections", order: 4 },
      { title: "Unit 5: Final Challenge & Certificate", description: "Prove you're a Cyber Defender", order: 5 },
    ];

    const unitIds: number[] = [];

    for (const u of unitsData) {
      const [unit] = await db
        .insert(schema.units)
        .values({
          courseId: course.id,
          title: u.title,
          description: u.description,
          order: u.order,
        })
        .returning({ id: schema.units.id });

      unitIds.push(unit.id);
    }

    // Lessons & challenges – unique questions per unit, only SELECT type
    let orderCounter = 1;

    for (let unitIndex = 0; unitIndex < unitIds.length; unitIndex++) {
      const unitId = unitIds[unitIndex];

      const [lesson] = await db
        .insert(schema.lessons)
        .values({
          unitId,
          title: "Core Training",
          order: 1,
        })
        .returning({ id: schema.lessons.id });

      // 4 unique SELECT challenges per lesson
      const challenges = getUnitChallenges(unitIndex + 1, orderCounter);  // pass unit number (1 to 5)
      orderCounter += challenges.length;

      for (const c of challenges) {
        const [ch] = await db
          .insert(schema.challenges)
          .values({
            lessonId: lesson.id,
            type: c.type,
            question: c.question,
            order: c.order,
          })
          .returning({ id: schema.challenges.id });

        await db.insert(schema.challengeOptions).values(
          c.options.map((opt) => ({
            challengeId: ch.id,
            text: opt.text,
            correct: opt.correct,
          }))
        );
      }
    }

    console.log("✅ Seeding finished successfully!");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

// Generate 4 unique SELECT challenges for each unit (unitNum = 1 to 5)
function getUnitChallenges(unitNum: number, startOrder: number) {
  const challenges = [];

  if (unitNum === 1) { // Unit 1: Security Fundamentals
    challenges.push(
      {
        type: "SELECT",
        question: "What does the 'C' in CIA triad stand for?",
        order: startOrder,
        options: [
          { text: "Confidentiality", correct: true },
          { text: "Connection", correct: false },
          { text: "Control", correct: false },
          { text: "Cryptography", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "Which principle ensures data is not altered without authorization?",
        order: startOrder + 1,
        options: [
          { text: "Integrity", correct: true },
          { text: "Availability", correct: false },
          { text: "Confidentiality", correct: false },
          { text: "Authentication", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "What does 'Availability' in CIA triad mean?",
        order: startOrder + 2,
        options: [
          
          { text: "Data is hidden from unauthorized users", correct: false },
          { text: "Data remains unchanged", correct: false },
          { text: "Data and systems are accessible when needed", correct: true },
          { text: "Data is encrypted", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "Which of these is NOT part of the CIA triad?",
        order: startOrder + 3,
        options: [
          { text: "Confidentiality", correct: false },
          { text: "Creativity", correct: true },
          { text: "Integrity", correct: false },
          { text: "Availability", correct: false },
        ],
      }
    );
  } else if (unitNum === 2) { // Unit 2: Phishing & Social Engineering
    challenges.push(
      {
        type: "SELECT",
        question: "What is phishing?",
        order: startOrder,
        options: [
         
          { text: "A method to encrypt data", correct: false },
          { text: "A firewall configuration", correct: false },
          { text: "An attack that tricks users into revealing sensitive information", correct: true },
          { text: "A software update process", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "Which is a common sign of a phishing email?",
        order: startOrder + 1,
        options: [
          
          { text: "Perfect grammar and company logo", correct: false },
          { text: "Urgent language and threats", correct: true },
          { text: "Sent from a known friend", correct: false },
          { text: "No links or attachments", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "What should you do with a suspicious email?",
        order: startOrder + 2,
        options: [
          { text: "Verify using official contact methods", correct: true },
          { text: "Click the link to check", correct: false },
          { text: "Reply with your password", correct: false },
          { text: "Forward to all contacts", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "Phishing that targets specific people is called?",
        order: startOrder + 3,
        options: [
          { text: "Spear phishing", correct: true },
          { text: "Mass phishing", correct: false },
          { text: "Random phishing", correct: false },
          { text: "Bulk phishing", correct: false },
        ],
      }
    );
  } else if (unitNum === 3) { // Unit 3: Passwords & Authentication
    challenges.push(
      {
        type: "SELECT",
        question: "Which is the strongest password?",
        order: startOrder,
        options: [
          
          { text: "password123", correct: false },
          { text: "1234567890", correct: false },
          { text: "MyDog2023", correct: false },
          { text: "X7#kP9$mQ2vL8!", correct: true },
        ],
      },
      {
        type: "SELECT",
        question: "What is the recommended minimum password length?",
        order: startOrder + 1,
        options: [
          
          { text: "6 characters", correct: false },
          { text: "8 characters exactly", correct: false },
          { text: "4 characters", correct: false },
          { text: "12 characters or more", correct: true },
        ],
      },
      {
        type: "SELECT",
        question: "What should you enable on all important accounts?",
        order: startOrder + 2,
        options: [
          { text: "Two-factor authentication (2FA)", correct: true },
          { text: "Automatic login", correct: false },
          { text: "Password sharing", correct: false },
          { text: "Single sign-on only", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "Why should you never reuse passwords?",
        order: startOrder + 3,
        options: [
          
          { text: "It makes login faster", correct: false },
          { text: "One breach can compromise multiple accounts", correct: true },
          { text: "It saves memory", correct: false },
          { text: "It is more secure", correct: false },
        ],
      }
    );
  } else if (unitNum === 4) { // Unit 4: Network & Wi-Fi Security
    challenges.push(
      {
        type: "SELECT",
        question: "What is the safest Wi-Fi encryption today?",
        order: startOrder,
        options: [
          
          { text: "WEP", correct: false },
          { text: "Open network", correct: false },
          { text: "WPA", correct: false },
          { text: "WPA3", correct: true },
        ],
      },
      {
        type: "SELECT",
        question: "What does a VPN primarily do?",
        order: startOrder + 1,
        options: [
          { text: "Encrypts your internet traffic", correct: true },
          { text: "Speeds up your connection", correct: false },
          { text: "Blocks all websites", correct: false },
          { text: "Installs antivirus", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "Why avoid public Wi-Fi without protection?",
        order: startOrder + 2,
        options: [
          
          { text: "It is always faster", correct: false },
          { text: "It uses less battery", correct: false },
          { text: "Attackers can intercept your data", correct: true },
          { text: "It is more secure", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "What should you do before using public Wi-Fi?",
        order: startOrder + 3,
        options: [
          
          { text: "Turn off firewall", correct: false },
          { text: "Share files openly", correct: false },
          { text: "Disable antivirus", correct: false },
          { text: "Use a VPN", correct: true },
        ],
      }
    );
  } else if (unitNum === 5) { // Unit 5: Final Challenge & Certificate
    challenges.push(
      {
        type: "SELECT",
        question: "What is the most important security habit?",
        order: startOrder,
        options: [
          
          { text: "Sharing passwords with friends", correct: false },
          { text: "Clicking unknown links", correct: false },
          { text: "Using strong passwords and 2FA everywhere", correct: true },
          { text: "Disabling antivirus", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "What should you do after finishing this course?",
        order: startOrder + 1,
        options: [
          
          { text: "Forget everything", correct: false },
          { text: "Share passwords", correct: false },
          { text: "Apply the knowledge in daily life", correct: true },
          { text: "Disable security features", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "Which habit greatly reduces risk?",
        order: startOrder + 2,
        options: [
          { text: "Verifying suspicious messages before acting", correct: true },
          { text: "Clicking all links quickly", correct: false },
          { text: "Reusing passwords", correct: false },
          { text: "Ignoring updates", correct: false },
        ],
      },
      {
        type: "SELECT",
        question: "You have earned your CyberDuo",
        order: startOrder + 3,
        options: [
          { text: "Certificate", correct: true },
          { text: "Penalty", correct: false },
          { text: "Warning", correct: false },
          { text: "Ban", correct: false },
        ],
      }
    );
  }

  return challenges;
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});