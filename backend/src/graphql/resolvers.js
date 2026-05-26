const { GraphQLError } = require('graphql');
const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/db');
const { signToken } = require('../utils/auth');
const { sendEmail } = require('../utils/email');
const { getWeatherByCity } = require('../utils/meteo');
const {
  sendOTPSchema, verifyOTPSchema, updateUserSchema,
  addTaskSchema, addDateSchema, addLinkSchema, addReminderSchema,
  editTaskSchema, editReminderSchema, editDateSchema, editLinkSchema,
  addQuicklinkSchema, editQuicklinkSchema,
} = require('../validation/schemas');

const OTP_EXPIRES_MINUTES = parseInt(process.env.OTP_EXPIRES_IN_MINUTES) || 10;

function requireAuth(user) {
  if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function mapCourse(c, tasks) {
  return {
    id: c._id.toString(),
    slug: c.slug,
    name: c.name,
    image: c.image,
    dates: (c.dates ?? []).map(d => ({ ...d, courseId: c._id.toString(), courseName: c.name })),
    links: c.links ?? [],
    tasks: tasks.map(t => ({
      id: t._id.toString(),
      title: t.title,
      done: t.done,
      pinned: t.pinned,
      courseId: c._id.toString(),
      courseName: c.name,
    })),
  };
}

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      requireAuth(user);
      const db = getDb();
      const found = await db.collection('users').findOne({ _id: new ObjectId(user.userId) });
      if (!found) throw new GraphQLError('User not found');
      return { id: found._id.toString(), name: found.name, email: found.email };
    },

    courses: async (_, __, { user }) => {
      requireAuth(user);
      const db = getDb();
      const userId = new ObjectId(user.userId);
      const courses = await db.collection('courses').find({ userId }).toArray();
      return Promise.all(courses.map(async (c) => {
        const tasks = await db.collection('tasks').find({ courseId: c._id, userId }).toArray();
        return mapCourse(c, tasks);
      }));
    },

    course: async (_, { slug }, { user }) => {
      requireAuth(user);
      const db = getDb();
      const userId = new ObjectId(user.userId);
      const c = await db.collection('courses').findOne({ slug, userId });
      if (!c) return null;
      const tasks = await db.collection('tasks').find({ courseId: c._id, userId }).toArray();
      return mapCourse(c, tasks);
    },

    myTasks: async (_, { pinned }, { user }) => {
      requireAuth(user);
      const db = getDb();
      const userId = new ObjectId(user.userId);
      const filter = { userId };
      if (pinned !== undefined && pinned !== null) filter.pinned = pinned;
      const tasks = await db.collection('tasks').find(filter).toArray();
      return Promise.all(tasks.map(async (t) => {
        const course = await db.collection('courses').findOne({ _id: t.courseId });
        return {
          id: t._id.toString(),
          title: t.title,
          done: t.done,
          pinned: t.pinned,
          courseId: t.courseId.toString(),
          courseName: course?.name ?? '',
        };
      }));
    },

    myPinnedDates: async (_, __, { user }) => {
      requireAuth(user);
      const db = getDb();
      const userId = new ObjectId(user.userId);
      const courses = await db.collection('courses').find({ userId }).toArray();
      const result = [];
      for (const c of courses) {
        for (const d of (c.dates ?? [])) {
          if (d.pinned) {
            result.push({ id: d.id, text: d.text, pinned: true, courseId: c._id.toString(), courseName: c.name });
          }
        }
      }
      return result;
    },

    myReminders: async (_, __, { user }) => {
      requireAuth(user);
      const db = getDb();
      const reminders = await db.collection('reminders').find({ userId: new ObjectId(user.userId) }).toArray();
      return reminders.map(r => ({ id: r._id.toString(), text: r.text, done: r.done }));
    },

    myQuicklinks: async (_, __, { user }) => {
      requireAuth(user);
      const db = getDb();
      const links = await db.collection('quicklinks').find({ userId: new ObjectId(user.userId) }).toArray();
      return links.map(l => ({ id: l._id.toString(), label: l.label, url: l.url }));
    },

    weather: async (_, { city }) => {
      return await getWeatherByCity(city);
    },
  },

  Mutation: {
    sendOTP: async (_, args) => {
      const { email, name } = sendOTPSchema.parse(args);
      const db = getDb();

      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser && name) {
        throw new GraphQLError('Account already exists', { extensions: { code: 'USER_EXISTS' } });
      }
      if (!existingUser && !name) {
        throw new GraphQLError('Name is required for new users');
      }

      const code = generateOTP();
      const expiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);

      await db.collection('otps').deleteMany({ email });
      await db.collection('otps').insertOne({ email, code, expiresAt, name: name ?? null });

      const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>StudyUp Authentication Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #171717 0%, #2d2d2d 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 3px;">StudyUp</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 50px 40px;">
                    <h2 style="margin: 0 0 20px; color: #171717; font-size: 24px; font-weight: 600;">Authentication Code</h2>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                      Here is your verification code. It is valid for <strong>${OTP_EXPIRES_MINUTES} minutes</strong>.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 30px 0;">
                          <div style="background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%); border-radius: 12px; padding: 30px; display: inline-block; border: 2px solid #9333ea;">
                            <p style="margin: 0 0 10px; color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your Code</p>
                            <p style="margin: 0; color: #171717; font-size: 48px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      If you did not request this code, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f9f9f9; padding: 30px 40px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">Copyright © 2026 StudyUp - All rights reserved</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;

      await sendEmail([email], 'Your login code', emailHTML);
      return true;
    },

    verifyOTP: async (_, args) => {
      const { email, code } = verifyOTPSchema.parse(args);
      const db = getDb();

      const otp = await db.collection('otps').findOne({ email });
      if (!otp || otp.code !== code || otp.expiresAt < new Date()) {
        throw new GraphQLError('Invalid or expired code');
      }

      await db.collection('otps').deleteOne({ _id: otp._id });

      let user = await db.collection('users').findOne({ email });
      if (!user) {
        const result = await db.collection('users').insertOne({ name: otp.name, email, createdAt: new Date() });
        user = { _id: result.insertedId, name: otp.name, email };
      }

      const token = signToken(user._id.toString());
      return { token, user: { id: user._id.toString(), name: user.name, email: user.email } };
    },

    updateUser: async (_, args, { user }) => {
      requireAuth(user);
      const { name } = updateUserSchema.parse(args);
      const db = getDb();
      const result = await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(user.userId) },
        { $set: { name } },
        { returnDocument: 'after' }
      );
      return { id: result._id.toString(), name: result.name, email: result.email };
    },

    deleteUser: async (_, __, { user }) => {
      requireAuth(user);
      const db = getDb();
      const userId = new ObjectId(user.userId);
      await db.collection('tasks').deleteMany({ userId });
      await db.collection('reminders').deleteMany({ userId });
      await db.collection('quicklinks').deleteMany({ userId });
      await db.collection('courses').deleteMany({ userId });
      await db.collection('users').deleteOne({ _id: userId });
      return true;
    },

    addCourse: async (_, { name }, { user }) => {
      requireAuth(user);
      const db = getDb();
      const userId = new ObjectId(user.userId);
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const image = `https://placehold.co/400x200?text=${encodeURIComponent(name.slice(0, 2).toUpperCase())}`;
      const result = await db.collection('courses').insertOne({ userId, slug, name, image, dates: [], links: [], createdAt: new Date() });
      return { id: result.insertedId.toString(), slug, name, image, dates: [], links: [], tasks: [] };
    },

    deleteCourse: async (_, { id }, { user }) => {
      requireAuth(user);
      const db = getDb();
      const courseId = new ObjectId(id);
      const userId = new ObjectId(user.userId);
      await db.collection('tasks').deleteMany({ courseId, userId });
      await db.collection('courses').deleteOne({ _id: courseId, userId });
      return true;
    },

    addDate: async (_, args, { user }) => {
      requireAuth(user);
      const { courseId, text } = addDateSchema.parse(args);
      const db = getDb();
      const userId = new ObjectId(user.userId);
      const newId = new ObjectId().toString();
      const result = await db.collection('courses').findOneAndUpdate(
        { _id: new ObjectId(courseId), userId },
        { $push: { dates: { id: newId, text, pinned: false } } },
        { returnDocument: 'after' }
      );
      if (!result) throw new GraphQLError('Course not found');
      return { id: newId, text, pinned: false, courseId, courseName: result.name };
    },

    deleteDate: async (_, { courseId, dateId }, { user }) => {
      requireAuth(user);
      const db = getDb();
      await db.collection('courses').updateOne(
        { _id: new ObjectId(courseId), userId: new ObjectId(user.userId) },
        { $pull: { dates: { id: dateId } } }
      );
      return true;
    },

    pinDate: async (_, { courseId, dateId, pinned }, { user }) => {
      requireAuth(user);
      const db = getDb();
      const result = await db.collection('courses').findOneAndUpdate(
        { _id: new ObjectId(courseId), userId: new ObjectId(user.userId), 'dates.id': dateId },
        { $set: { 'dates.$.pinned': pinned } },
        { returnDocument: 'after' }
      );
      if (!result) throw new GraphQLError('Date not found');
      const date = result.dates.find(d => d.id === dateId);
      return { id: date.id, text: date.text, pinned: date.pinned, courseId, courseName: result.name };
    },

    addLink: async (_, args, { user }) => {
      requireAuth(user);
      const { courseId, label, url } = addLinkSchema.parse(args);
      const db = getDb();
      const newId = new ObjectId().toString();
      const result = await db.collection('courses').findOneAndUpdate(
        { _id: new ObjectId(courseId), userId: new ObjectId(user.userId) },
        { $push: { links: { id: newId, label, url } } },
        { returnDocument: 'after' }
      );
      if (!result) throw new GraphQLError('Course not found');
      return { id: newId, label, url };
    },

    deleteLink: async (_, { courseId, linkId }, { user }) => {
      requireAuth(user);
      const db = getDb();
      await db.collection('courses').updateOne(
        { _id: new ObjectId(courseId), userId: new ObjectId(user.userId) },
        { $pull: { links: { id: linkId } } }
      );
      return true;
    },

    addTask: async (_, args, { user }) => {
      requireAuth(user);
      const { courseId, title } = addTaskSchema.parse(args);
      const db = getDb();
      const courseObjId = new ObjectId(courseId);
      const course = await db.collection('courses').findOne({ _id: courseObjId });
      if (!course) throw new GraphQLError('Course not found');
      const result = await db.collection('tasks').insertOne({
        userId: new ObjectId(user.userId),
        courseId: courseObjId,
        title,
        done: false,
        pinned: false,
        createdAt: new Date(),
      });
      return { id: result.insertedId.toString(), title, done: false, pinned: false, courseId, courseName: course.name };
    },

    toggleTask: async (_, { id }, { user }) => {
      requireAuth(user);
      const db = getDb();
      const task = await db.collection('tasks').findOne({ _id: new ObjectId(id), userId: new ObjectId(user.userId) });
      if (!task) throw new GraphQLError('Task not found');
      const result = await db.collection('tasks').findOneAndUpdate(
        { _id: task._id },
        { $set: { done: !task.done } },
        { returnDocument: 'after' }
      );
      const course = await db.collection('courses').findOne({ _id: result.courseId });
      return { id: result._id.toString(), title: result.title, done: result.done, pinned: result.pinned, courseId: result.courseId.toString(), courseName: course?.name ?? '' };
    },

    pinTask: async (_, { id, pinned }, { user }) => {
      requireAuth(user);
      const db = getDb();
      const result = await db.collection('tasks').findOneAndUpdate(
        { _id: new ObjectId(id), userId: new ObjectId(user.userId) },
        { $set: { pinned } },
        { returnDocument: 'after' }
      );
      if (!result) throw new GraphQLError('Task not found');
      const course = await db.collection('courses').findOne({ _id: result.courseId });
      return { id: result._id.toString(), title: result.title, done: result.done, pinned: result.pinned, courseId: result.courseId.toString(), courseName: course?.name ?? '' };
    },

    deleteTask: async (_, { id }, { user }) => {
      requireAuth(user);
      const db = getDb();
      await db.collection('tasks').deleteOne({ _id: new ObjectId(id), userId: new ObjectId(user.userId) });
      return true;
    },

    addReminder: async (_, args, { user }) => {
      requireAuth(user);
      const { text } = addReminderSchema.parse(args);
      const db = getDb();
      const result = await db.collection('reminders').insertOne({
        userId: new ObjectId(user.userId),
        text,
        done: false,
        createdAt: new Date(),
      });
      return { id: result.insertedId.toString(), text, done: false };
    },

    toggleReminder: async (_, { id }, { user }) => {
      requireAuth(user);
      const db = getDb();
      const reminder = await db.collection('reminders').findOne({ _id: new ObjectId(id), userId: new ObjectId(user.userId) });
      if (!reminder) throw new GraphQLError('Reminder not found');
      const result = await db.collection('reminders').findOneAndUpdate(
        { _id: reminder._id },
        { $set: { done: !reminder.done } },
        { returnDocument: 'after' }
      );
      return { id: result._id.toString(), text: result.text, done: result.done };
    },

    deleteReminder: async (_, { id }, { user }) => {
      requireAuth(user);
      const db = getDb();
      await db.collection('reminders').deleteOne({ _id: new ObjectId(id), userId: new ObjectId(user.userId) });
      return true;
    },

    editTask: async (_, args, { user }) => {
      requireAuth(user);
      const { id, title } = editTaskSchema.parse(args);
      const db = getDb();
      const result = await db.collection('tasks').findOneAndUpdate(
        { _id: new ObjectId(id), userId: new ObjectId(user.userId) },
        { $set: { title } },
        { returnDocument: 'after' }
      );
      if (!result) throw new GraphQLError('Task not found');
      const course = await db.collection('courses').findOne({ _id: result.courseId });
      return { id: result._id.toString(), title: result.title, done: result.done, pinned: result.pinned, courseId: result.courseId.toString(), courseName: course?.name ?? '' };
    },

    editReminder: async (_, args, { user }) => {
      requireAuth(user);
      const { id, text } = editReminderSchema.parse(args);
      const db = getDb();
      const result = await db.collection('reminders').findOneAndUpdate(
        { _id: new ObjectId(id), userId: new ObjectId(user.userId) },
        { $set: { text } },
        { returnDocument: 'after' }
      );
      if (!result) throw new GraphQLError('Reminder not found');
      return { id: result._id.toString(), text: result.text, done: result.done };
    },

    editDate: async (_, args, { user }) => {
      requireAuth(user);
      const { courseId, dateId, text } = editDateSchema.parse(args);
      const db = getDb();
      const result = await db.collection('courses').findOneAndUpdate(
        { _id: new ObjectId(courseId), userId: new ObjectId(user.userId), 'dates.id': dateId },
        { $set: { 'dates.$.text': text } },
        { returnDocument: 'after' }
      );
      if (!result) throw new GraphQLError('Date not found');
      const date = result.dates.find(d => d.id === dateId);
      return { id: date.id, text: date.text, pinned: date.pinned, courseId, courseName: result.name };
    },

    editLink: async (_, args, { user }) => {
      requireAuth(user);
      const { courseId, linkId, label, url } = editLinkSchema.parse(args);
      const db = getDb();
      const result = await db.collection('courses').findOneAndUpdate(
        { _id: new ObjectId(courseId), userId: new ObjectId(user.userId), 'links.id': linkId },
        { $set: { 'links.$.label': label, 'links.$.url': url } },
        { returnDocument: 'after' }
      );
      if (!result) throw new GraphQLError('Link not found');
      const link = result.links.find(l => l.id === linkId);
      return { id: link.id, label: link.label, url: link.url };
    },

    addQuicklink: async (_, args, { user }) => {
      requireAuth(user);
      const { label, url } = addQuicklinkSchema.parse(args);
      const db = getDb();
      const result = await db.collection('quicklinks').insertOne({
        userId: new ObjectId(user.userId),
        label,
        url,
        createdAt: new Date(),
      });
      return { id: result.insertedId.toString(), label, url };
    },

    editQuicklink: async (_, args, { user }) => {
      requireAuth(user);
      const { id, label, url } = editQuicklinkSchema.parse(args);
      const db = getDb();
      const result = await db.collection('quicklinks').findOneAndUpdate(
        { _id: new ObjectId(id), userId: new ObjectId(user.userId) },
        { $set: { label, url } },
        { returnDocument: 'after' }
      );
      if (!result) throw new GraphQLError('Quicklink not found');
      return { id: result._id.toString(), label: result.label, url: result.url };
    },

    deleteQuicklink: async (_, { id }, { user }) => {
      requireAuth(user);
      const db = getDb();
      await db.collection('quicklinks').deleteOne({ _id: new ObjectId(id), userId: new ObjectId(user.userId) });
      return true;
    },
  },
};

module.exports = resolvers;
