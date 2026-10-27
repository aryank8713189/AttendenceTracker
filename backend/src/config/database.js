const mongoose = require('mongoose');
const Student = require('../models/Student');

const ensureTeacherScopedStudentRollNumbers = async () => {
    const indexes = await Student.collection.indexes();

    // Older deployments may still have a globally unique rollNo index. The
    // schema's compound index is intentionally unique only per teacher.
    for (const index of indexes) {
        const keys = Object.entries(index.key || {});
        const isGlobalRollNumberIndex =
            index.unique === true &&
            keys.length === 1 &&
            keys[0][0] === 'rollNo';

        if (isGlobalRollNumberIndex) {
            await Student.collection.dropIndex(index.name);
            console.log(Removed legacy global student roll number index: ${index.name});
        }
    }

    await Student.collection.createIndex(
        { teacherId: 1, rollNo: 1 },
        { unique: true, name: 'teacherId_1_rollNo_1' }
    );
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(MongoDB connected: ${conn.connection.host});
        await ensureTeacherScopedStudentRollNumbers();
        console.log('Student roll number uniqueness is scoped to each teacher.');
    } catch (error) {
        console.error("MongoDB connection Failed");
        console.error(error.message);

        process.exit(1); // <--- FIXED TYPO HERE (was pocess)
    }
};

module.exports = connectDB;
