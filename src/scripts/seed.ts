import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Starting CyberDuo seed...");

  try {
    // Clear everything
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.userSubscription);

    // Create course
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

      // 4 SELECT challenges – unique per unit
      const challenges = getUnitChallenges(unitIndex + 1, orderCounter);
      orderCounter += challenges.length;

      for (const c of challenges) {
        const [ch] = await db
          .insert(schema.challenges)
          .values({
            lessonId: lesson.id,
            type: "SELECT",
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

function getUnitChallenges(unitNumber: number, startOrder: number) {
  const challenges = [];

  if (unitNumber === 1) {
    challenges.push(
      { question: "What does the 'C' in CIA triad stand for?", order: startOrder, options: [
        { text: "Confidentiality", correct: true },
        { text: "Connection", correct: false },
        { text: "Control", correct: false },
        { text: "Cryptography", correct: false },
      ]},
      { question: "Which ensures data is not altered without authorization?", order: startOrder + 1, options: [
        { text: "Integrity", correct: true },
        { text: "Availability", correct: false },
        { text: "Confidentiality", correct: false },
        { text: "Authentication", correct: false },
      ]},
      { question: "What does 'Availability' mean?", order: startOrder + 2, options: [
        { text: "Data and systems are accessible when needed", correct: true },
        { text: "Data is hidden", correct: false },
        { text: "Data is encrypted", correct: false },
        { text: "Data is deleted", correct: false },
      ]},
      { question: "Which is NOT part of the CIA triad?", order: startOrder + 3, options: [
        { text: "Creativity", correct: true },
        { text: "Confidentiality", correct: false },
        { text: "Integrity", correct: false },
        { text: "Availability", correct: false },
      ]},
    );
  } else if (unitNumber === 2) {
    challenges.push(
      { question: "What is phishing?", order: startOrder, options: [
        { text: "Tricking users into giving sensitive information", correct: true },
        { text: "Encrypting emails", correct: false },
        { text: "Firewall setup", correct: false },
        { text: "Browser update", correct: false },
      ]},
      { question: "Common sign of phishing email?", order: startOrder + 1, options: [
        { text: "Urgent threats", correct: true },
        { text: "Perfect grammar", correct: false },
        { text: "From friend", correct: false },
        { text: "No links", correct: false },
      ]},
      { question: "Best action for suspicious email?", order: startOrder + 2, options: [
        { text: "Verify official way", correct: true },
        { text: "Click link", correct: false },
        { text: "Reply password", correct: false },
        { text: "Forward", correct: false },
      ]},
      { question: "Targeted phishing is called?", order: startOrder + 3, options: [
        { text: "Spear phishing", correct: true },
        { text: "Mass phishing", correct: false },
        { text: "Random phishing", correct: false },
        { text: "Bulk phishing", correct: false },
      ]},
    );
  } else if (unitNumber === 3) {
    challenges.push(
      { question: "Strongest password?", order: startOrder, options: [
        { text: "X7#kP9$mQ2vL8!", correct: true },
        { text: "password123", correct: false },
        { text: "1234567890", correct: false },
        { text: "MyDog2023", correct: false },
      ]},
      { question: "Minimum strong password length?", order: startOrder + 1, options: [
        { text: "12+ characters", correct: true },
        { text: "6 characters", correct: false },
        { text: "8 exactly", correct: false },
        { text: "4 characters", correct: false },
      ]},
      { question: "Enable this on accounts?", order: startOrder + 2, options: [
        { text: "Two-factor authentication", correct: true },
        { text: "Auto login", correct: false },
        { text: "Share passwords", correct: false },
        { text: "Single sign-on", correct: false },
      ]},
      { question: "Why never reuse passwords?", order: startOrder + 3, options: [
        { text: "One breach hits many accounts", correct: true },
        { text: "Faster login", correct: false },
        { text: "Saves memory", correct: false },
        { text: "More secure", correct: false },
      ]},
    );
  } else if (unitNumber === 4) {
    challenges.push(
      { question: "Safest Wi-Fi encryption?", order: startOrder, options: [
        { text: "WPA3", correct: true },
        { text: "WEP", correct: false },
        { text: "Open network", correct: false },
        { text: "WPA", correct: false },
      ]},
      { question: "VPN main purpose?", order: startOrder + 1, options: [
        { text: "Encrypts traffic", correct: true },
        { text: "Speeds up", correct: false },
        { text: "Blocks sites", correct: false },
        { text: "Installs AV", correct: false },
      ]},
      { question: "Danger of public Wi-Fi?", order: startOrder + 2, options: [
        { text: "Data interception", correct: true },
        { text: "Faster", correct: false },
        { text: "Less battery", correct: false },
        { text: "More secure", correct: false },
      ]},
      { question: "Before public Wi-Fi do what?", order: startOrder + 3, options: [
        { text: "Use VPN", correct: true },
        { text: "Disable firewall", correct: false },
        { text: "Share files", correct: false },
        { text: "Disable AV", correct: false },
      ]},
    );
  } else { // Unit 5
    challenges.push(
      { question: "Most important security habit?", order: startOrder, options: [
        { text: "Strong passwords + 2FA", correct: true },
        { text: "Share passwords", correct: false },
        { text: "Click unknown links", correct: false },
        { text: "Disable AV", correct: false },
      ]},
      { question: "After course do what?", order: startOrder + 1, options: [
        { text: "Apply daily", correct: true },
        { text: "Forget it", correct: false },
        { text: "Share passwords", correct: false },
        { text: "Disable features", correct: false },
      ]},
      { question: "Best risk reduction?", order: startOrder + 2, options: [
        { text: "Verify messages", correct: true },
        { text: "Click fast", correct: false },
        { text: "Reuse passwords", correct: false },
        { text: "Ignore updates", correct: false },
      ]},
      { question: "You earned your CyberDuo", order: startOrder + 3, options: [
        { text: "Certificate", correct: true },
        { text: "Penalty", correct: false },
        { text: "Warning", correct: false },
        { text: "Ban", correct: false },
      ]},
    );
  }

  return challenges;
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});