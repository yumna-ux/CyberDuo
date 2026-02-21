import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Starting safe CyberDuo seed...");

  try {
    // Clear data in safe order
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.userSubscription);

    // Create course
    const [course] = await db.insert(schema.courses).values({
      title: "Cybersecurity Mastery",
      imageSrc: "/cyber-shield.png",
    }).returning({ id: schema.courses.id });

    // 3 units – order is number literal
    const unitsToInsert = [
      { title: "Unit 1 – Fundamentals", description: "Core concepts", order: 1 },
      { title: "Unit 2 – Threats", description: "Recognize attacks", order: 2 },
      { title: "Unit 3 – Defense", description: "Practical skills", order: 3 },
    ];

    const unitIds: number[] = [];

    for (const u of unitsToInsert) {
      const [unit] = await db.insert(schema.units).values({
        courseId: course.id,
        title: u.title,
        description: u.description,
        order: u.order,  // explicit number
      }).returning({ id: schema.units.id });

      unitIds.push(unit.id);
    }

    // Lessons & challenges – order always number literal or ++
    let orderCounter = 1;

    for (const unitId of unitIds) {
      // 1 lesson per unit (minimal but valid)
      const [lesson] = await db.insert(schema.lessons).values({
        unitId,
        title: "Core Training",
        order: 1,  // number literal
      }).returning({ id: schema.lessons.id });

      // 4 challenges – all order as number
      const challengeData = [
        {
          type: "SELECT",
          question: "What does CIA stand for?",
          order: orderCounter++,
          options: [
            { text: "Confidentiality, Integrity, Availability", correct: true },
            { text: "Control, Internet, Access", correct: false },
            { text: "Cloud, Information, Authentication", correct: false },
            { text: "Cryptography, Intrusion, Attack", correct: false },
          ],
        },
        {
          type: "ASSIST",
          question: "Protecting systems from digital attacks is called",
          correctAnswer: "cybersecurity",
          order: orderCounter++,
        },
        {
          type: "SELECT",
          question: "Which password is strongest?",
          order: orderCounter++,
          options: [
            { text: "X7#kP9$mQ2vL8!", correct: true },
            { text: "password123", correct: false },
            { text: "1234567890", correct: false },
            { text: "MyDog2023", correct: false },
          ],
        },
        {
          type: "ASSIST",
          question: "Always enable this on important accounts",
          correctAnswer: "two-factor authentication",
          order: orderCounter++,
        },
      ];

      for (const ch of challengeData) {
        const [challenge] = await db.insert(schema.challenges).values({
          lessonId: lesson.id,
          type: ch.type,
          question: ch.question,
          order: ch.order,  // always number from ++ or literal
        }).returning({ id: schema.challenges.id });

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

    console.log("✅ Seed completed");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

main();