/*
  Warnings:

  - You are about to drop the column `code` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `managerId` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Project` table. All the data in the column will be lost.
  - The `status` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `description` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `parentTaskId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.
  - The `priority` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `content` on the `TaskComment` table. All the data in the column will be lost.
  - You are about to drop the column `changedBy` on the `TaskStatusHistory` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `TaskStatusHistory` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `WorkflowDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `WorkflowState` table. All the data in the column will be lost.
  - You are about to drop the column `isFinal` on the `WorkflowState` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `WorkflowState` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `WorkflowState` table. All the data in the column will be lost.
  - You are about to drop the column `actionLabel` on the `WorkflowTransition` table. All the data in the column will be lost.
  - You are about to drop the column `allowedRoles` on the `WorkflowTransition` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskAssignee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskAttachment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `TaskComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `changedById` to the `TaskStatusHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WorkflowDefinition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `WorkflowState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WorkflowState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actionName` to the `WorkflowTransition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `allowedRole` to the `WorkflowTransition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WorkflowTransition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'RESIGNED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_parentTaskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskAssignee" DROP CONSTRAINT "TaskAssignee_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskAssignee" DROP CONSTRAINT "TaskAssignee_userId_fkey";

-- DropForeignKey
ALTER TABLE "TaskAttachment" DROP CONSTRAINT "TaskAttachment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowTransition" DROP CONSTRAINT "WorkflowTransition_fromStateId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowTransition" DROP CONSTRAINT "WorkflowTransition_toStateId_fkey";

-- DropIndex
DROP INDEX "Department_code_key";

-- DropIndex
DROP INDEX "WorkflowDefinition_name_key";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "code",
DROP COLUMN "managerId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "link",
DROP COLUMN "type",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "createdBy",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "departmentId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "description",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "createdBy",
DROP COLUMN "parentTaskId",
DROP COLUMN "position",
DROP COLUMN "status",
ADD COLUMN     "assigneeId" TEXT,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "statusId" TEXT NOT NULL,
DROP COLUMN "priority",
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "TaskComment" DROP COLUMN "content",
ADD COLUMN     "message" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TaskStatusHistory" DROP COLUMN "changedBy",
DROP COLUMN "comment",
ADD COLUMN     "changedById" TEXT NOT NULL,
ALTER COLUMN "fromStatus" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
DROP COLUMN "firstName",
DROP COLUMN "isActive",
DROP COLUMN "lastName",
DROP COLUMN "password",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "WorkflowDefinition" DROP COLUMN "isActive",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "WorkflowState" DROP COLUMN "color",
DROP COLUMN "isFinal",
DROP COLUMN "label",
DROP COLUMN "position",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "WorkflowTransition" DROP COLUMN "actionLabel",
DROP COLUMN "allowedRoles",
ADD COLUMN     "actionName" TEXT NOT NULL,
ADD COLUMN     "allowedRole" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "ProjectMember";

-- DropTable
DROP TABLE "RolePermission";

-- DropTable
DROP TABLE "TaskAssignee";

-- DropTable
DROP TABLE "TaskAttachment";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "WorkflowState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
