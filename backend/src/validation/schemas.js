import { z } from 'zod';

const sendOTPSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(30).optional(),
});

const verifyOTPSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const updateUserSchema = z.object({
  name: z.string().min(1).max(30),
});

const addTaskSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1).max(200),
});

const addDateSchema = z.object({
  courseId: z.string().min(1),
  text: z.string().min(1).max(200),
});

const addLinkSchema = z.object({
  courseId: z.string().min(1),
  label: z.string().min(1).max(100),
  url: z.string().url(),
});

const addReminderSchema = z.object({
  text: z.string().min(1).max(300),
});

const editTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
});

const editReminderSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(300),
});

const editDateSchema = z.object({
  courseId: z.string().min(1),
  dateId: z.string().min(1),
  text: z.string().min(1).max(200),
});

const editLinkSchema = z.object({
  courseId: z.string().min(1),
  linkId: z.string().min(1),
  label: z.string().min(1).max(100),
  url: z.string().url(),
});

const addQuicklinkSchema = z.object({
  label: z.string().min(1).max(100),
  url: z.string().url(),
});

const editQuicklinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(100),
  url: z.string().url(),
});

export {
  sendOTPSchema, verifyOTPSchema, updateUserSchema,
  addTaskSchema, addDateSchema, addLinkSchema, addReminderSchema,
  editTaskSchema, editReminderSchema, editDateSchema, editLinkSchema,
  addQuicklinkSchema, editQuicklinkSchema,
};
