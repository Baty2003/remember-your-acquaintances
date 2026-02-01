-- CreateTable
CREATE TABLE "MeetingPlace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "MeetingPlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "ageType" TEXT,
    "height" TEXT,
    "occupation" TEXT,
    "occupationDetails" TEXT,
    "whereMet" TEXT,
    "howMet" TEXT,
    "photo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "meetingPlaceId" TEXT,
    CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Contact_meetingPlaceId_fkey" FOREIGN KEY ("meetingPlaceId") REFERENCES "MeetingPlace" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Contact" ("age", "ageType", "createdAt", "height", "howMet", "id", "name", "occupation", "occupationDetails", "photo", "updatedAt", "userId", "whereMet") SELECT "age", "ageType", "createdAt", "height", "howMet", "id", "name", "occupation", "occupationDetails", "photo", "updatedAt", "userId", "whereMet" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
CREATE INDEX "Contact_userId_idx" ON "Contact"("userId");
CREATE INDEX "Contact_meetingPlaceId_idx" ON "Contact"("meetingPlaceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "MeetingPlace_userId_idx" ON "MeetingPlace"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingPlace_userId_name_key" ON "MeetingPlace"("userId", "name");
