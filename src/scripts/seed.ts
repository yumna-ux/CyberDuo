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
    console.log("Clearing existing data...");
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.userSubscription);

    // Create one main course (simple and focused)
    console.log("Creating course...");
    const [course] = await db
      .insert(schema.courses)
      .values({
        title: "Cybersecurity Mastery",
        imageSrc: "/mascot.svg", // or /mascot.svg if you prefer
      })
      .returning({ id: schema.courses.id });

    // 3 units – all have title AND description (fixes NOT NULL error)
    console.log("Creating units...");
    const unitData = [
      {
        title: "Unit 1 – Fundamentals",
        description: "Learn the core concepts every cyber defender needs to know.",
        order: 1,
      },
      {
        title: "Unit 2 – Common Threats",
        description: "Recognize and understand the most frequent cyber attacks.",
        order: 2,
      },
      {
        title: "Unit 3 – Strong Defense",
        description: "Build practical skills to protect yourself and your systems.",
        order: 3,
      },
    ];

    const unitIds: number[] = [];

    for (const u of unitData) {
      const [unit] = await db
        .insert(schema.units)
        .values({
          courseId: course.id,
          title: u.title,
          description: u.description, // ← this line fixes the error
          order: u.order,
        })
        .returning({ id: schema.units.id });

      unitIds.push(unit.id);
    }

    // Lessons & challenges
    console.log("Creating lessons and challenges...");
    let globalOrder = 1;

    for (const unitId of unitIds) {
      // 2 lessons per unit (simple but complete)
      for (let l = 1; l <= 2; l++) {
        const [lesson] = await db
          .insert(schema.lessons)
          .values({
            unitId,
            title: l === 1 ? "Core Concepts" : "Practical Skills",
            order: l,
          })
          .returning({ id: schema.lessons.id });

        // 4 challenges per lesson (2 SELECT + 2 ASSIST)
        const challenges = [
          {
            type: "SELECT",
            question: "What does CIA stand for in cybersecurity?",
            order: globalOrder++,
            options: [
              { text: "Confidentiality, Integrity, Availability", correct: true },
              { text: "Control, Internet, Access", correct: false },
              { text: "Cloud, Information, Authentication", correct: false },
              { text: "Cryptography, Intrusion, Attack", correct: false },
            ],
          },
          {
            type: "ASSIST",
            question: "The practice of protecting systems from digital attacks is called",
            order: globalOrder++,
             options: [
              { text: "cybersecurity", correct: true },
              { text: "Internet break", correct: false },
              { text: "Civil engieering", correct: false },
              { text: "Crypto check", correct: false },
            ],
          },
          {
            type: "SELECT",
            question: "Which password is the strongest?",
            order: globalOrder++,
            options: [
              { text: "X7#kP9$mQ2vL8!", correct: true },
              { text: "password123", correct: false },
              { text: "1234567890", correct: false },
              { text: "MyDog2023", correct: false },
            ],
          },
          {
            type: "ASSIST",
            question: "Always enable this on important accounts for extra security",
            correctAnswer: "",
            order: globalOrder++,
            options: [
              { text: "flash light", correct: false },
              { text: "darkmode", correct: false },
              { text: "two-factor authentication", correct: true },
            ],
          },
        ];

        for (const ch of challenges) {
          const [challenge] = await db
            .insert(schema.challenges)
            .values({
              lessonId: lesson.id,
              type: ch.type,
              question: ch.question,
              order: ch.order,
            })
            .returning({ id: schema.challenges.id });

          if (ch.options) {
            await db.insert(schema.challengeOptions).values(
              ch.options.map(opt => ({
                challengeId: challenge.id,
                text: opt.text,
                correct: opt.correct,
              }))
            );
          } else if (ch.correctAnswer) {
            await db.insert(schema.challengeOptions).values({
              challengeId: challenge.id,
              text: ch.correctAnswer,
              correct: true,
            });
          }
        }
      }
    }

    console.log("✅ Seeding finished successfully!");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

main();